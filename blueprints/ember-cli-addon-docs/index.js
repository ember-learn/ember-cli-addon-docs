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
        'ember-cli-fastboot',
        'prember',
      ],
    });
  },

  afterInstall() {
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
