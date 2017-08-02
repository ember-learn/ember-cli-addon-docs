'use strict';

const fs = require('fs-extra');
const path = require('path');
const Minimatch = require('minimatch').Minimatch;
const quickTemp = require('quick-temp');
const hostedGitInfo = require('hosted-git-info');
const git = require('../utils/git');

module.exports = class AddonDocsDeployPlugin {
  constructor(userConfig) {
    this.name = 'addon-docs';
    this.userConfig = userConfig;
  }

  configure(context) {
    return Promise.all([
      git.getCurrentBranch(),
      git.getCurrentTag(),
    ]).then((result) => {
      return {
        addonDocs: {
          branch: result[0],
          tag: result[1]
        }
      };
    });
  }

  setup(context) {
    let state = context.addonDocs;

    if (!this.userConfig.shouldDeploy(state.branch, state.tag)) {
      context.ui.writeInfoLine('[ember-cli-addon-docs] shouldDeploy() returned false; skipping deploy');

      // Rejecting the promise would also work to cancel the deploy, but would result in a non-zero exit status
      process.exit(0);
    }

    if (!context.gitDeploy) {
      throw new Error('ember-cli-addon-docs relies on ember-cli-deploy-git in the deploy pipeline');
    }

    // If no git repo was explicitly set, guess at the SSH URL from package.json
    if (!context.config.git || !context.config.git.repo) {
      this._inferRepoUrl(context);
    }

    state.stagingDirectory = quickTemp.makeOrRemake(this, 'deployStagingDirectory');
  }

  willUpload(context) {
    let relativeBuildDestination = this._getBuildDestination(context);
    let stagingDirectory = context.addonDocs.stagingDirectory;
    let fullBuildDestination = path.join(stagingDirectory, relativeBuildDestination);

    return this._copyExistingFiles(context, relativeBuildDestination)
      .then(() => fs.copy(context.distDir, fullBuildDestination, { overwrite: true }))
      .then(() => context.distDir = stagingDirectory);
  }

  teardown() {
    quickTemp.remove(this, 'deployStagingDirectory');
  }

  _copyExistingFiles(context, deploySubdirectory) {
    let matcher = this._buildMatcher();
    let from = context.gitDeploy.worktreePath;
    let to = context.addonDocs.stagingDirectory;
    let filter = (filePath) => {
      if (fs.lstatSync(filePath).isDirectory()) { return true; }

      // Always preserve files outside our deploy directory, and those the user explicitly opts into keeping
      let relativeFilePath = filePath.substring(from.length + 1);
      return relativeFilePath.indexOf(deploySubdirectory) !== 0 || matcher.match(relativeFilePath);
    };

    return fs.copy(from, to, { filter });
  }

  _buildMatcher() {
    let preserve = this.userConfig.preserve;
    if (!preserve || !preserve.length) {
      return { match: () => false };
    } else {
      let expression = preserve.length === 1 ? preserve[0] : `{${preserve.join(',')}}`;
      return new Minimatch(expression, { dot: true });
    }
  }

  _getBuildDestination(context) {
    let state = context.addonDocs;
    return this.userConfig.deployDirectory(state.branch, state.tag) || '';
  }

  _inferRepoUrl(context) {
    let repository = context.project.pkg.repository;
    if (repository) {
      let url = repository.url || repository;
      context.gitDeploy.repo = hostedGitInfo.fromUrl(url).ssh();
    }
  }
}
