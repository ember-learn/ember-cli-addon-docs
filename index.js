/* eslint-env node */
'use strict';

const path = require('path');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-cli-addon-docs',

  config(env, baseConfig) {
    return {
      'ember-component-css': {
        namespacing: false
      }
    };
  },

  included() {
    this._super.included.apply(this, arguments);

    // TODO make theme configurable?
    this.import('vendor/highlightjs-styles/default.css');
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateCompiler = require('./lib/preprocessors/markdown-template-compiler');
      registry.add('template', new TemplateCompiler());
    }
  },

  treeForVendor(vendor) {
    return new MergeTrees([
      vendor,
      new Funnel(path.dirname(require.resolve('highlightjs/package.json')), {
        srcDir: 'styles',
        destDir: 'highlightjs-styles'
      })
    ]);
  },

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
