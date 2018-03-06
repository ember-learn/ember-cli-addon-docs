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
    let configPath = require.resolve(this.project.configPath());
    let configContents = fs.readFileSync(configPath, 'utf-8');

    if (configContents.indexOf('ADDON_DOCS_ROOT_URL') === -1) {
      configContents = configContents.replace(/([ \t]+)if \(environment === 'production'\) {/, [
        '$&',
        '$1  // Allow ember-cli-addon-docs to update the rootURL in compiled assets',
        '$1  ENV.rootURL = \'ADDON_DOCS_ROOT_URL\';'
      ].join('\n'));

      if (configContents.indexOf('ADDON_DOCS_ROOT_URL') === -1) {
        this.ui.writeWarnLine(
          `Unable to update rootURL configuration. You should update ${configPath} so that your rootURL is ` +
          `the string 'ADDON_DOCS_ROOT_URL' in production.`);
      }
    }

    fs.writeFileSync(configPath, configContents, 'utf-8');

    const hasPlugins = this.project.addons.some(function(addon) {
      const isPlugin = addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin') !== -1;
      const isPluginPack = addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin-pack') !== -1;
      return isPlugin || isPluginPack;
    });

    if (!hasPlugins) {
      return this.addAddonsToProject({
        packages: ['ember-cli-addon-docs-yuidoc']
      })
    }
  }
};
