'use strict';

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const quickTemp = require('quick-temp');
const hostedGitInfo = require('hosted-git-info');
const maybeMigrateSiteFormat = require('./migration');

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

  // This will be invoked after the default build plugin instance, but before
  // the second one that we add in order to facilitate the `latest` build if
  // it's been requested.
  build() {

  }

  willUpload(context) {
    let relativeBuildDestination = path.join('versions', this.userConfig.getVersionPath());
    let stagingDirectory = context.addonDocs.stagingDirectory;

    return this._copyExistingFiles(context, relativeBuildDestination)
      .then(() => maybeMigrateSiteFormat(context, this))
      .then(() => this._maybeClearLatest(stagingDirectory))
      .then(() => this._copyBuildOutput(context, stagingDirectory, relativeBuildDestination))
      .then(() => this._verifyRedirectFile(stagingDirectory))
      .then(() => this._updateVersionsManifest(stagingDirectory))
      .then(() => context.distDir = stagingDirectory);
  }


  teardown() {
    quickTemp.remove(this, 'deployStagingDirectory');
  }

  _verifyRedirectFile(stagingDirectory) {
    let vendorDir = `${__dirname}/../../vendor/ember-cli-addon-docs`;
    let rootURL = this.userConfig._getNormalizedRootUrl();
    let segmentCount = rootURL === '' ? 0 : rootURL.split('/').length;
    let redirectContents = fs.readFileSync(`${vendorDir}/404.html`, 'utf-8');
    let redirects = this._discoverOldPaths(stagingDirectory);

    redirectContents = redirectContents.replace(/\bADDON_DOCS_SEGMENT_COUNT\b/g, segmentCount);
    redirectContents = redirectContents.replace(/\bADDON_DOCS_REDIRECTS\b/, JSON.stringify(redirects));
    fs.writeFileSync(`${stagingDirectory}/404.html`, redirectContents);
  }

  _discoverOldPaths(stagingDirectory) {
    try {
      let versions = require(`${stagingDirectory}/versions.json`);
      let redirects = {};
      Object.keys(versions).forEach(key => {
        let entry = versions[key];
        if (entry.oldPath) {
          redirects[entry.oldPath] = entry.path;
        }
      });
      return redirects;
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
      return [];
    }
  }

  _updateVersionsManifest(stagingDirectory) {
    let versionsFile = `${stagingDirectory}/versions.json`;
    let versions = fs.existsSync(versionsFile) ? fs.readJSONSync(versionsFile) : {};
    let version = this._currentDeployVersion();
    let key = version.key;
    delete version.key;
    versions[key] = version;

    if (this.userConfig.shouldUpdateLatest()) {
      let version = this._latestDeployVersion();
      let key = version.key;
      delete version.key;
      versions[key] = version;
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

  _copyBuildOutput(context, stagingDirectory) {
    return fs.copy(context.distDir, stagingDirectory, { overwrite: true });
  }

  _maybeClearLatest(stagingDirectory) {
    if (!this.userConfig.shouldUpdateLatest()) { return; }

    return filterDir(stagingDirectory,
      relativeName => ['versions', 'versions.json', '404.html'].includes(relativeName)
    );
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

function filterDir(dir, predicate) {
  return fs.readdir(dir).then(files => {
    return Promise.all(files.map(file => {
      if (!predicate(file)){
        return fs.remove(path.join(dir, file));
      }
    }));
  })
}
