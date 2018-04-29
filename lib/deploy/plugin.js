'use strict';

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const quickTemp = require('quick-temp');
const hostedGitInfo = require('hosted-git-info');
const walkSync = require('walk-sync');

const VERSION_PREFIX = 'v';

module.exports = class AddonDocsDeployPlugin {
  constructor(userConfig) {
    this.name = 'addon-docs';
    this.userConfig = userConfig;
  }

  configure(context) {
    return {
      addonDocs: {}
    };
  }

  setup(context) {
    if (!this.userConfig.getVersionPath()) {
      return Promise.reject('no addon-docs version path configured; skipping deploy');
    }

    if (!context.gitDeploy) {
      return Promise.reject('ember-cli-addon-docs relies on ember-cli-deploy-git in the deploy pipeline');
    }

    // If no git repo was explicitly set, guess at the SSH URL from package.json
    if (!context.config.git || !context.config.git.repo) {
      this._inferRepoUrl(context);
    }

    context.addonDocs.stagingDirectory = quickTemp.makeOrRemake(this, 'deployStagingDirectory');

    return this._verifyDeployBranch(context);
  }

  willUpload(context) {
    let relativeBuildDestination = this._getVersionPath();
    let stagingDirectory = context.addonDocs.stagingDirectory;
    let fullBuildDestination = path.join(stagingDirectory, relativeBuildDestination);

    fs.ensureDirSync(fullBuildDestination);

    return this._copyExistingFiles(context, relativeBuildDestination)
      .then(() => this._copyBuildOutput(context, stagingDirectory, relativeBuildDestination))
      .then(() => this._verifyRedirectFile(stagingDirectory))
      .then(() => this._updateVersionsManifest(stagingDirectory))
      .then(() => this._maybeUpdateLatest(context, stagingDirectory, fullBuildDestination))
      .then(() => context.distDir = stagingDirectory);
  }

  teardown() {
    quickTemp.remove(this, 'deployStagingDirectory');
  }

  _getVersionPath() {
    return `${VERSION_PREFIX}/${this.userConfig.getVersionPath()}`;
  }

  _verifyRedirectFile(stagingDirectory) {
    let vendorDir = `${__dirname}/../../vendor/ember-cli-addon-docs`;
    let segmentCount = this._getRootURL().split('/').length;
    let redirectContents = fs.readFileSync(`${vendorDir}/404.html`, 'utf-8');
    redirectContents = redirectContents.replace(/\bADDON_DOCS_SEGMENT_COUNT\b/g, segmentCount);
    fs.writeFileSync(`${stagingDirectory}/404.html`, redirectContents);
  }

  _getRootURL() {
    return this.userConfig.getRootURL().replace(/^\/|\/$/g, '');
  }

  _updateVersionsManifest(stagingDirectory) {
    let versionsFile = `${stagingDirectory}/versions.json`;
    let versions = fs.existsSync(versionsFile) ? fs.readJSONSync(versionsFile) : {};
    let version = this._currentDeployVersion();

    versions[version.name] = version;

    if (this.userConfig.shouldUpdateLatest()) {
      versions['latest'] = this._latestDeployVersion();
    }

    fs.writeJSONSync(versionsFile, versions, { spaces: 2 });
  }

  _copyExistingFiles(context, deploySubdirectory) {
    let from = context.gitDeploy.worktreePath;
    let to = context.addonDocs.stagingDirectory;
    let filter = (filePath) => {
      if (fs.lstatSync(filePath).isDirectory()) { return true; }

      // Always preserve files outside our deploy directory
      let relativeFilePath = filePath.substring(from.length + 1);
      return relativeFilePath.indexOf(deploySubdirectory) !== 0;
    };

    return fs.copy(from, to, { filter });
  }

  _copyBuildOutput(context, stagingDirectory, relativeBuildDestination) {
    let fullBuildDestination = `${stagingDirectory}/${relativeBuildDestination}`;
    let deployVersion = this._currentDeployVersion();
    return fs.copy(context.distDir, fullBuildDestination, { overwrite: true })
      .then(() => this._updateIndexContents(context, stagingDirectory, relativeBuildDestination, deployVersion));
  }

  _maybeUpdateLatest(context, stagingDirectory) {
    if (!this.userConfig.shouldUpdateLatest()) { return; }

    let deployVersion = this._latestDeployVersion();
    let manifestPath = `${stagingDirectory}/root-deploy-files.json`;
    let deletions = [];

    if (fs.existsSync(manifestPath)) {
      for (let file of fs.readJSONSync(manifestPath)) {
        deletions.push(fs.remove(`${stagingDirectory}/${file}`));
      }
    }

    return Promise.all(deletions)
      .then(() => fs.writeJSON(manifestPath, walkSync(context.distDir, { directories: false })))
      .then(() => fs.copy(context.distDir, stagingDirectory))
      .then(() => this._updateIndexContents(context, stagingDirectory, '', deployVersion));
  }

  _updateIndexContents(context, stagingDirectory, appRoot, deployVersion) {
    let indexPath = `${stagingDirectory}/${appRoot}/index.html`;
    let rootURL = [this._getRootURL(), appRoot].filter(Boolean).join('/');
    let contents = fs.readFileSync(indexPath, 'utf-8');
    let encodedVersion = encodeURIComponent(JSON.stringify(deployVersion));
    let updated = contents.replace(/\/?ADDON_DOCS_ROOT_URL\/?/g, `/${rootURL}/`)
      .replace(/%22ADDON_DOCS_DEPLOY_VERSION%22/g, encodedVersion);

    fs.writeFileSync(indexPath, updated);
  }

  _currentDeployVersion() {
    let path = this._getVersionPath();
    let name = this.userConfig.getVersionName();
    let sha = this.userConfig.repoInfo.sha;
    let tag = this.userConfig.repoInfo.tag;
    return { path, name, sha, tag };
  }

  _latestDeployVersion() {
    let path = '';
    let name = 'latest';
    let sha = this.userConfig.repoInfo.sha;
    let tag = this.userConfig.repoInfo.tag;
    return { path, name, sha, tag };
  }

  _inferRepoUrl(context) {
    let repository = context.project.pkg.repository;
    if (repository) {
      let url = repository.url || repository;
      context.gitDeploy.repo = hostedGitInfo.fromUrl(url).ssh();
    }
  }

  _verifyDeployBranch(context) {
    if (process.env.CI) { return; }

    let deployBranch = context.gitDeploy.branch;
    return git('fetch', '--all')
      .then(() => git('branch', '--list', '--all', deployBranch, `*/${deployBranch}`))
      .then((output) => {
        if (!output.length) {
          return this._createDeployBranch(context, deployBranch);
        }
      });
  }

  _createDeployBranch(context, deployBranch) {
    context.ui.write('');
    let prompt = context.ui.prompt([{
      type: 'confirm',
      name: 'createDeployBranch',
      message: `The specified deploy branch '${deployBranch}' doesn't exist. Would you like to create it?`,
      default: true,
    }]);

    let branchStatus = git('status', '--porcelain');

    return Promise.all([prompt, branchStatus]).then((response) => {
      if (!response[0].createDeployBranch) {
        return Promise.reject(`Target branch doesn't exist; aborting deploy...`);
      }

      if (response[1].length) {
        return Promise.reject(`Can't create a deploy branch while the current one has pending changes`);
      }

      let currentBranch;
      return git('rev-parse', '--abbrev-ref', 'HEAD')
        .then((output) => currentBranch = output)
        .then(() => git('checkout', '--orphan', deployBranch))
        .then(() => git('rm', '-r', '--cached', '.'))
        .then(() => git('add', '.gitignore'))
        .then(() => git('clean', '-df'))
        .then(() => git('commit', '-m', `Initial commit to ${deployBranch}`))
        .then(() => git('push', '-u', 'origin', deployBranch))
        .then(() => git('checkout', currentBranch));
    });
  }
}

function git() {
  return execa('git', [].slice.call(arguments))
    .then((result) => result.stdout.trim());
}
