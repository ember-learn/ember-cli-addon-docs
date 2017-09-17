'use strict';

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const Minimatch = require('minimatch').Minimatch;
const quickTemp = require('quick-temp');
const hostedGitInfo = require('hosted-git-info');
const gitRepoInfo = require('git-repo-info');

module.exports = class AddonDocsDeployPlugin {
  constructor(userConfig) {
    this.name = 'addon-docs';
    this.userConfig = userConfig;
  }

  configure(context) {
    return {
      addonDocs: {
        repoInfo: gitRepoInfo()
      }
    };
  }

  setup(context) {
    let state = context.addonDocs;

    if (!this.userConfig.shouldDeploy(state.repoInfo)) {
      return Promise.reject('[ember-cli-addon-docs] shouldDeploy() returned false; skipping deploy');
    }

    if (!context.gitDeploy) {
      return Promise.reject('ember-cli-addon-docs relies on ember-cli-deploy-git in the deploy pipeline');
    }

    // If no git repo was explicitly set, guess at the SSH URL from package.json
    if (!context.config.git || !context.config.git.repo) {
      this._inferRepoUrl(context);
    }

    state.stagingDirectory = quickTemp.makeOrRemake(this, 'deployStagingDirectory');

    return this._verifyDeployBranch(context);
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
    let matcher = this._buildMatcher(context);
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

  _buildMatcher(context) {
    let preservedPaths = this.userConfig.preservedPaths(context.addonDocs.repoInfo);
    if (!preservedPaths || !preservedPaths.length) {
      return { match: () => false };
    } else {
      let expression = preservedPaths.length === 1 ? preservedPaths[0] : `{${preservedPaths.join(',')}}`;
      return new Minimatch(expression, { dot: true });
    }
  }

  _getBuildDestination(context) {
    return this.userConfig.deployDirectory(context.addonDocs.repoInfo) || '';
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
