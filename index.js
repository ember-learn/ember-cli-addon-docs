'use strict';

const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line node/no-unpublished-require
const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');

module.exports = {
  name: 'ember-cli-addon-docs',

  isDevelopingAddon() {
    return true;
  },

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
    },
    svgJar: {
      sourceDirs: [
        'public',
        'node_modules/ember-cli-addon-docs/public',
        'tests/dummy/public'
      ]
    }
  },

  config(env, baseConfig) {
    let config = {
      'ember-component-css': {
        namespacing: false
      },
      'ember-cli-addon-docs': {
        packageJson: this.parent.pkg
      }
    };

    let updatedConfig = Object.assign({}, baseConfig, config);

    // Augment config with addons we depend on
    updatedConfig = this.addons.reduce((config, addon) => {
      if (addon.config) {
        config = Object.assign({}, addon.config(env, config), config);
      }
      return config;
    }, updatedConfig);

    return updatedConfig;
  },

  included(includer) {
    if (includer.parent) {
      throw new Error(`ember-cli-addon-docs should be in your package.json's devDependencies`);
    } else if (includer.name === this.project.name()) {
      throw new Error(`ember-cli-addon-docs only currently works with addons, not applications`);
    }

    this._super.included.apply(this, arguments);

    includer.options.includeFileExtensionInSnippetNames = includer.options.includeFileExtensionInSnippetNames || false;
    includer.options.snippetSearchPaths = includer.options.snippetSearchPaths || ['tests/dummy/app'];
    includer.options.snippetRegexes = Object.assign({}, {
      begin: /{{#(?:docs-snippet|demo.example|demo.live-example)\sname=(?:"|')(\S+)(?:"|')/,
      end: /{{\/(?:docs-snippet|demo.example|demo.live-example)}}/,
    }, includer.options.snippetRegexes);

    let importer = findImporter(this);

    importer.import(`${this._hasEmberSource() ? 'vendor' : 'bower_components'}/ember/ember-template-compiler.js`);
    importer.import('vendor/lunr/lunr.js', {
      using: [{ transformation: 'amd', as: 'lunr' }]
    });

    // importer.import('vendor/highlightjs-styles/default.css');
    // importer.import('vendor/styles/highlightjs-styles/default.css');
    // importer.import('vendor/highlight.js/styles/monokai.css');
    // importer.import('vendor/highlightjs-styles/github.css');
  },

  createDeployPlugin() {
    const AddonDocsDeployPlugin = require('./lib/deploy/plugin');
    const readConfig = require('./lib/utils/read-config');

    let userConfig = readConfig(this.project);
    return new AddonDocsDeployPlugin(userConfig);
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateCompiler = require('./lib/preprocessors/markdown-template-compiler');
      let ContentExtractor = require('./lib/preprocessors/hbs-content-extractor');
      registry.add('template', new TemplateCompiler());
      registry.add('template', this.contentExtractor = new ContentExtractor());
    }
  },

  contentFor(type) {
    if (type === 'body') {
      return fs.readFileSync(`${__dirname}/vendor/ember-cli-addon-docs/github-spa.html`, 'utf-8');
    }
  },

  treeForApp(app) {
    let trees = [ app ];

    let addonPath;
    if (this.project.name() === this.name) {
      addonPath = this.project.root;
    } else {
      addonPath = this.project.findAddonByName(this.name).root;
    }
    let addonTree = new Funnel(path.join(addonPath, 'addon'), {
      include: ['**/*.js']
    });
    let autoExportedAddonTree = new AutoExportAddonToApp([ addonTree ]);
    trees.push(autoExportedAddonTree);

    return new MergeTrees(trees);
  },

  treeForAddon(tree) {
    let dummyAppFiles = new FindDummyAppFiles([ 'tests/dummy/app' ]);

    return this._super(new MergeTrees([ tree, dummyAppFiles ]));
  },

  treeForVendor(vendor) {
    return new MergeTrees([
      vendor,
      this._highlightJSTree(),
      this._lunrTree(),
      this._templateCompilerTree()
    ].filter(Boolean));
  },

  treeForPublic() {
    let parentAddon = this.parent.findAddonByName(this.parent.name());
    let defaultTree = this._super.treeForPublic.apply(this, arguments);
    if (!parentAddon) { return defaultTree; }

    let DocsGenerator = require('./lib/broccoli/docs-generator');
    let SearchIndexer = require('./lib/broccoli/search-indexer');

    let addonSources = path.resolve(parentAddon.root, parentAddon.treePaths.addon);
    let docsTree = new DocsGenerator([addonSources], {
      project: this.project,
      destDir: 'docs'
    });

    let templateContentsTree = this.contentExtractor.getTemplateContentsTree();
    let searchIndexTree = new SearchIndexer(new MergeTrees([docsTree, templateContentsTree]), {
      outputFile: 'ember-cli-addon-docs/search-index.json',
      config: this.project.config(EmberApp.env())
    });

    let notFoundSnippet = new Funnel(`${__dirname}/vendor/ember-cli-addon-docs`, {
      include: ['404.html']
    });

    return new MergeTrees([ defaultTree, notFoundSnippet, docsTree, searchIndexTree ]);
  },

  _lunrTree() {
    return new Funnel(path.dirname(require.resolve('lunr/package.json')), { destDir: 'lunr' });
  },

  _highlightJSTree() {
    return new Funnel(path.dirname(require.resolve('highlightjs/package.json')), {
      srcDir: 'styles',
      destDir: 'highlightjs-styles'
    });
  },

  _templateCompilerTree() {
    if (this._hasEmberSource()) {
      return new Funnel(path.dirname(resolve.sync('ember-source/package.json'), { basedir: this.project.root }), {
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

class FindDummyAppFiles extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];
    let paths = walkSync(addonPath, { directories: false })
    let pathsString = JSON.stringify(paths);

    fs.writeFileSync(path.join(this.outputPath, 'app-files.js'), `export default ${pathsString};`);
  }
}

class AutoExportAddonToApp extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];

    // Components
    walkSync(path.join(addonPath, 'components'), { directories: false })
      .forEach(addonFile => {
        let module = addonFile.replace('/component.js', '');
        let file = path.join(this.outputPath, 'components', `${module}.js`);
        ensureDirectoryExistence(file);
        fs.writeFileSync(file, `export { default } from 'ember-cli-addon-docs/components/${module}/component';`);
      });

    // Non-pods modules (slightly different logic)
    [ 'adapters', 'controllers', 'models', 'routes', 'services', 'transitions' ].forEach(moduleType => {
      let addonFullPath = path.join(addonPath, moduleType);
      if (!fs.existsSync(addonFullPath)) {
        return;
      }
      let addonFiles = walkSync(addonFullPath, { directories: false });

      addonFiles.forEach(addonFile => {
        let module = addonFile.replace('.js', '');
        let file = path.join(this.outputPath, moduleType, `${module}.js`);
        ensureDirectoryExistence(file);
        fs.writeFileSync(file, `export { default } from 'ember-cli-addon-docs/${moduleType}/${module}';`);
      });
    });

  }
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
