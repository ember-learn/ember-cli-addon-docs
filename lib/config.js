'use strict';

const gitRepoInfo = require('git-repo-info');

module.exports = class AddonDocsConfig {
  constructor() {
    this.repoInfo = gitRepoInfo();
  }

  /**
   * This hook controls whether the 'latest' docs version alis will be updated
   * to point to the current build. By default, this will return true whenever
   * a deploy is occurring from a tagged commit.
   *
   * The default behavior can be overridden by setting the environment variable
   * ADDON_DOCS_UPDATE_LATEST to 'true' or 'false'.
   *
   * @return {boolean} Whether to update the 'latest' docs version alias.
   */
  shouldUpdateLatest() {
    if ('ADDON_DOCS_UPDATE_LATEST' in process.env) {
      return process.env.ADDON_DOCS_UPDATE_LATEST !== 'false';
    }

    return !!this.repoInfo.tag;
  }

  /**
   * This hook sets the directory that this version will be deployed to,
   * typically either a tag (e.g. 'v1.2.3'), the string "master" for
   * deploying bleeding-edge docs, or nothing at all to skip deploying.
   *
   * The default behavior can be overridden by setting the environment variable
   * ADDON_DOCS_VERSION_PATH to the desired location (or to '' to skip).
   *
   * @return {string} The target directory for this build's files in the deploy
   * branch
   */
  getVersionPath() {
    if ('ADDON_DOCS_VERSION_PATH' in process.env) {
      return process.env.ADDON_DOCS_VERSION_PATH;
    }

    if (this.repoInfo.tag) {
      return this.repoInfo.tag;
    }

    let branch = this.repoInfo.branch || process.env.TRAVIS_BRANCH;
    if (branch === 'master') {
      return branch;
    }
  }

  getVersionName() {
    return this.getVersionPath();
  }
}
