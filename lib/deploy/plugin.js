'use strict';

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const quickTemp = require('quick-temp');
const hostedGitInfo = require('hosted-git-info');

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
      return Promise.reject('[ember-cli-addon-docs] no version path configured; skipping deploy');
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
    let relativeBuildDestination = this.userConfig.getVersionPath();
    let stagingDirectory = context.addonDocs.stagingDirectory;
    let fullBuildDestination = path.join(stagingDirectory, relativeBuildDestination);

    return this._copyExistingFiles(context, relativeBuildDestination)
      .then(() => this._copyBuildOutput(context, fullBuildDestination))
      .then(() => this._verifyRootFiles(stagingDirectory))
      .then(() => this._updateVersionsManifest(stagingDirectory))
      .then(() => this._maybeUpdateLatest(context, stagingDirectory, fullBuildDestination))
      .then(() => context.distDir = stagingDirectory);
  }

  teardown() {
    quickTemp.remove(this, 'deployStagingDirectory');
  }

  _verifyRootFiles(stagingDirectory) {
    let vendorDir = `${__dirname}/../../vendor/ember-cli-addon-docs`;

    for (let file of ['index.html', '404.html']) {
      if (!fs.existsSync(`${stagingDirectory}/${file}`)) {
        fs.copySync(`${vendorDir}/${file}`, `${stagingDirectory}/${file}`);
      }
    }
  }

  _updateVersionsManifest(stagingDirectory) {
    let versionsFile = `${stagingDirectory}/versions.json`;
    let versions = fs.existsSync(versionsFile) ? fs.readJSONSync(versionsFile) : {};
    let path = this.userConfig.getVersionPath();
    let name = this.userConfig.getVersionName();
    let sha = this.userConfig.repoInfo.sha;
    let tag = this.userConfig.repoInfo.tag;

    versions[path] = { sha, tag, path, name };
    if (this.userConfig.shouldUpdateLatest()) {
      versions['latest'] = { sha, tag, path: 'latest', name: 'latest' };
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

  _copyBuildOutput(context, fullBuildDestination) {
    return fs.copy(context.distDir, fullBuildDestination, { overwrite: true })
      .then(() => this._updateRootURL(context, fullBuildDestination));
  }

  _maybeUpdateLatest(context, stagingDirectory) {
    if (!this.userConfig.shouldUpdateLatest()) { return; }

    let latestDir = path.join(stagingDirectory, 'latest');
    return fs.remove(latestDir)
      .then(() => fs.copy(context.distDir, latestDir))
      .then(() => this._updateRootURL(context, latestDir));
  }

  _updateRootURL(context, appRoot) {
    let indexPath = `${appRoot}/index.html`;
    let rootURL = `${this._projectName(context)}/${path.basename(appRoot)}`;
    let contents = fs.readFileSync(indexPath, 'utf-8');
    let updated = contents.replace(/\bADDON_DOCS_ROOT_URL\b/g, rootURL);
    fs.writeFileSync(indexPath, updated);
  }

  _projectName(context) {
    let repository = context.config.git.repo;
    let info = hostedGitInfo.fromUrl(repository);
    return info && info.project || context.project.name();
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
