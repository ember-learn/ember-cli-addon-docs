'use strict';

const fs = require('fs-extra');
const path = require('path');
const updateDemoUrl = require('../../lib/utils/update-demo-url');

module.exports = {
  name: 'ember-cli-addon-docs',

  normalizeEntityName() {
    // No-op to avoid an error since we don't require an entity name
  },

  beforeInstall() {
    return this.addAddonsToProject({
      packages: [
        'ember-cli-addon-docs-yuidoc',
        'ember-cli-deploy',
        'ember-cli-deploy-build',
        'ember-cli-deploy-git',
        'ember-cli-deploy-git-ci',
        'ember-data',
      ],
    });
  },

  afterInstall(options) {
    let configPath = require.resolve(this.project.configPath());
    let configContents = fs.readFileSync(configPath, 'utf-8');

    if (configContents.indexOf('ADDON_DOCS_ROOT_URL') === -1) {
      configContents = configContents.replace(
        /([ \t]+)if \(environment === 'production'\) {/,
        [
          '$&',
          '$1  // Allow ember-cli-addon-docs to update the rootURL in compiled assets',
          "$1  ENV.rootURL = '/ADDON_DOCS_ROOT_URL/';",
        ].join('\n'),
      );

      if (configContents.indexOf('ADDON_DOCS_ROOT_URL') === -1) {
        this.ui.writeWarnLine(
          `Unable to update rootURL configuration. You should update ${configPath} so that your rootURL is ` +
            `the string '/ADDON_DOCS_ROOT_URL/' in production.`,
        );
      }
    }

    fs.writeFileSync(configPath, configContents, 'utf-8');

    if (fs.existsSync('.npmignore')) {
      this.insertIntoFile('.npmignore', '/config/addon-docs.js');
    }

    const packageJsonPath = path.join(this.project.root, 'package.json');
    const updatedDemoUrl = updateDemoUrl(packageJsonPath);

    if (!updatedDemoUrl) {
      this.ui.writeWarnLine(
        `Unable to update the "homepage" configuration in your package.json. To include this for ` +
          `including a link on Ember Observer, set it to https://{ORGANIZATION}.github.io/{REPO}`,
      );
    }
  },
};
