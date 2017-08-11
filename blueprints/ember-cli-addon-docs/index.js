'use strict';

module.exports = {
  name: 'ember-cli-addon-docs',

  normalizeEntityName() {
    // No-op to avoid an error since we don't require an entity name
  },

  beforeInstall() {
    return this.addAddonsToProject({
      packages: [
        'ember-cli-deploy',
        'ember-cli-deploy-build',
        'ember-cli-deploy-git',
        'ember-cli-deploy-git-ci'
      ]
    });
  }
};
