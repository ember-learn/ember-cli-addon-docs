'use strict';

module.exports = class AddonDocsConfig {
  shouldDeploy() {
    return true;
  }

  deployDirectory() {
    // Just deploy to the root
  }

  preservedPaths() {
    return ['.gitignore'];
  }
}
