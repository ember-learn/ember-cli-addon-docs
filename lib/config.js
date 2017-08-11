'use strict';

module.exports = class AddonDocsConfig {
  get preservePaths() {
    return [];
  }

  shouldDeploy() {
    return true;
  }

  deployDirectory() {
    // Just deploy to the root
  }
}
