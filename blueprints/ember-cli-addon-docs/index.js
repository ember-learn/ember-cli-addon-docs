'use strict';

const fs = require('fs-extra');

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
  },

  afterInstall() {
    const configPath = require.resolve(this.project.configPath());
    const configContents = fs.readFileSync(configPath, 'utf-8')
      .replace(/rootURL: .*,/, `rootURL: '/${this.project.name()}/',`)
      .replace(/locationType: .*,/, `locationType: 'hash',`);

    fs.writeFileSync(configPath, configContents, 'utf-8');
    this.ui.writeInfoLine('Updated dummy app rootURL and locationType for compatibility with GitHub Pages.');
  }
};
