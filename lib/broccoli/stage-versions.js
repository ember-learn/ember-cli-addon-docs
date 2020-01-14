'use strict';

const BroccoliPlugin = require('broccoli-plugin');
const fs = require('fs-extra');
const path = require('path');

module.exports = class StageVersions extends BroccoliPlugin {
  constructor(allTree, userConfig) {
    super([allTree]);
    this.userConfig = userConfig;
  }

  build() {
    if (this.userConfig.shouldPlaceVersion()) {
      let versionPath = `versions/${this.userConfig.getVersionPath()}`;
      let fullVersionPath = path.join(this.outputPath, versionPath);

      let rootUrl = this.userConfig._getNormalizedRootUrl();
      let versionRootUrl = rootUrl ? `${rootUrl}/${versionPath}` : versionPath;

      fs.ensureDirSync(fullVersionPath);
      fs.copySync(this.inputPaths[0], fullVersionPath);

      this._updateIndexContents(fullVersionPath, versionRootUrl, this.userConfig._currentDeployVersion());

      if (this.userConfig.shouldUpdateLatest()) {
        fs.copySync(this.inputPaths[0], this.outputPath);
        this._updateIndexContents(this.outputPath, rootUrl, this.userConfig._latestDeployVersion());
      }
    } else {
      fs.copySync(this.inputPaths[0], this.outputPath);
      this._updateIndexContents(this.outputPath, '', this.userConfig._latestDeployVersion());
    }
  }

  _updateIndexContents(sourceDir, rootUrl, deployVersion) {
    let indexPath = `${sourceDir}/index.html`;
    let addonDocsRootURL = rootUrl === '' ? '/' : `/${rootUrl}/`;
    let contents = fs.readFileSync(indexPath, 'utf-8');
    let encodedVersion = encodeURIComponent(JSON.stringify(deployVersion));
    let updated = this._macroReplaceIndexContent(contents, addonDocsRootURL, encodedVersion);

    fs.writeFileSync(indexPath, updated);
  }

  _macroReplaceIndexContent(contents, addonDocsRootURL, encodedDeployVersion) {
    return contents
      // .replace('%2FADDON_DOCS_ROOT_URL%2F', encodeURIComponent(addonDocsRootURL))
      // .replace(/\/?ADDON_DOCS_ROOT_URL\/?/g, addonDocsRootURL)
      .replace(/%22ADDON_DOCS_DEPLOY_VERSION%22/g, encodedDeployVersion);
  }
};
