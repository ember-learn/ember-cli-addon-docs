/* eslint-env node */
'use strict';

const AddonDocsConfig = require('../lib/config');

module.exports = class extends AddonDocsConfig {
  shouldDeploy(repoInfo) {
    if (process.env.CI) {
      // If in CI, deploy whenever we do a build on master in the default ember-try scenario
      return repoInfo.branch === 'master' && process.env.EMBER_TRY_SCENARIO === 'ember-default';
    } else {
      // Always deploy when `ember deploy` is manually run
      return true;
    }
  }
}
