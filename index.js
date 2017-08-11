/* eslint-env node */
'use strict';

const path = require('path');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-cli-addon-docs',

  options: {
    ace: {
      modes: ['handlebars']
    },
    nodeAssets: {
      'highlight.js': {
        public: {
          include: [ 'styles/monokai.css' ]
        },
        vendor: {
          include: [ 'styles/monokai.css' ]
        }
      }
    }
  },

  config(env, baseConfig) {
    return {
      'ember-component-css': {
        namespacing: false
      }
    };
  },

 included(parentApp) {
    this._super.included.apply(this, arguments);

    // Do not override the parent options if they have already been defined.
    if (!parent.options.snippetSearchPaths) {
      parent.options.snippetSearchPaths = ['tests/dummy/app'];
    }
    if (!parent.options.snippetRegexes) {
      parent.options.snippetRegexes = {
        begin: /{{#(?:docs-snippet|demo.example|demo.live-example)\sname=(?:\"|\')(\S+)(?:\"|\')/,
        end: /{{\/(?:docs-snippet|demo.example|demo.live-example)}}/,
      }
    }

    let importer = findImporter(this);

    importer.import(`${this._hasEmberSource() ? 'vendor' : 'bower_components'}/ember/ember-template-compiler.js`);
    // importer.import('vendor/highlightjs-styles/default.css');
    // importer.import('vendor/styles/highlightjs-styles/default.css');
    // importer.import('vendor/highlight.js/styles/monokai.css');
    // importer.import('vendor/highlightjs-styles/github.css');
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
      this._highlightJSTree(),
      this._templateCompilerTree()
    ].filter(Boolean));
  },

  treeForPublic() { 
    let parentAddon = this.parent.treePaths ? this.parent : this;
    let DocsGenerator = require('./lib/broccoli/docs-generator');
    let addonSources = path.resolve(parentAddon.root, parentAddon.treePaths.addon);
    return new DocsGenerator([addonSources], {
      project: this.project,
      destDir: 'docs'
    });
  },

  _highlightJSTree() {
    return new Funnel(path.dirname(require.resolve('highlightjs/package.json')), {
      srcDir: 'styles',
      destDir: 'highlightjs-styles'
    });
  },

  _templateCompilerTree() {
    if (this._hasEmberSource()) {
      return new Funnel(path.dirname(require.resolve('ember-source/package.json')), {
        srcDir: 'dist',
        destDir: 'ember'
      });
    }
  },

  _hasEmberSource() {
    return 'ember-source' in this.project.pkg.devDependencies;
  }
};

function findImporter(addon) {
  if (typeof addon.import === 'function') {
    // If addon.import() is present (CLI 2.7+) use that
    return addon;
  } else {
    // Otherwise, reuse the _findHost implementation that would power addon.import()
    let current = addon;
    let app;
    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));
    return app;
  }
}
