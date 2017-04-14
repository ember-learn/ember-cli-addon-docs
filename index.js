/* eslint-env node */
'use strict';

const path = require('path');

module.exports = {
  name: 'ember-cli-addon-docs',

  treeForPublic() {
    let parentAddon = this.parent.findAddonByName(this.parent.name());
    if (!parentAddon) { return; }

    let DocsGenerator = require('./lib/broccoli/docs-generator');
    let addonSources = path.resolve(parentAddon.root, parentAddon.treePaths.addon);
    return new DocsGenerator([addonSources], {
      project: this.project,
      destDir: 'docs'
    });
  }
};
