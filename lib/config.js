'use strict';

const gitRepoInfo = require('git-repo-info');
const semver = require('semver');

module.exports = class AddonDocsConfig {
  constructor() {
    this.repoInfo = gitRepoInfo();
  }

  getVersionPath() {
    if ('ADDON_DOCS_VERSION_PATH' in process.env) {
      return process.env.ADDON_DOCS_VERSION_PATH;
    }

    if (this.repoInfo.tag) {
      return this.repoInfo.tag;
    }

    return this.repoInfo.branch || process.env.TRAVIS_BRANCH;
  }

  getVersionName() {
    if ('ADDON_DOCS_VERSION_NAME' in process.env) {
      return process.env.ADDON_DOCS_VERSION_NAME;
    }

    return this.getVersionPath();
  }

  shouldUpdateLatest() {
    if ('ADDON_DOCS_UPDATE_LATEST' in process.env) {
      return process.env.ADDON_DOCS_UPDATE_LATEST !== 'false';
    }

    let tag = this.repoInfo.tag;
    if (tag) {
      return !semver.prerelease(tag);
    }
  }
}
