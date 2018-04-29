'use strict';

const gitRepoInfo = require('git-repo-info');
const hostedGitInfo = require('hosted-git-info');
const semver = require('semver');

module.exports = class AddonDocsConfig {
  constructor(project) {
    this.project = project;
    this.repoInfo = gitRepoInfo();
  }

  getRootURL() {
    let repository = this.project.pkg.repository || '';
    let info = hostedGitInfo.fromUrl(repository.url || repository);
    return info && info.project || this.project.name();
  }

  getVersionPath() {
    if ('ADDON_DOCS_VERSION_PATH' in process.env) {
      return process.env.ADDON_DOCS_VERSION_PATH;
    }

    if (this.repoInfo.tag) {
      // Turn v1.0.0 -> 1.0.0 since we're prefixing with /v/
      return this.repoInfo.tag.replace(/^v(\d)/i, '$1');
    }

    return this.repoInfo.branch || process.env.TRAVIS_BRANCH;
  }

  getVersionName() {
    if ('ADDON_DOCS_VERSION_NAME' in process.env) {
      return process.env.ADDON_DOCS_VERSION_NAME;
    }

    return this.repoInfo.tag || this.repoInfo.branch || process.env.TRAVIS_BRANCH;
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
