'use strict';

const fs = require('fs');
const path = require('path');
const UnwatchedDir = require('broccoli-source').UnwatchedDir;
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line node/no-unpublished-require
const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const buildTailwind = require('ember-cli-tailwind/lib/build-tailwind');

const LATEST_VERSION_NAME = '-latest';

module.exports = {
  name: 'ember-cli-addon-docs',

  LATEST_VERSION_NAME,

  options: {
    svgJar: {
      sourceDirs: [
        'public',
        'node_modules/ember-cli-addon-docs/public',
        'tests/dummy/public'
      ],
      optimizer : {
        plugins: [
          {
            removeAttrs: {
              attrs: [ 'fill' ]
            }
          }
        ]
      }
    }
  },

  config(env, baseConfig) {
    let repo = this.parent.pkg.repository;
    let info = require('hosted-git-info').fromUrl(repo.url || repo);
    let userConfig = this._readUserConfig();

    let config = {
      'ember-cli-addon-docs': {
        projectName: this.parent.pkg.name,
        projectDescription: this.parent.pkg.description,
        projectTag: this.parent.pkg.version,
        projectHref: info && info.browse(),
        primaryBranch: userConfig.getPrimaryBranch(),
        latestVersionName: LATEST_VERSION_NAME,
        deployVersion: 'ADDON_DOCS_DEPLOY_VERSION',
        searchTokenSeparator: "\\s+"
      },
      'ember-component-css': {
        namespacing: false
      },
      'ember-cli-tailwind': {
        shouldIncludeStyleguide: false,
        shouldBuildTailwind: false
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

    includer.options.includeFileExtensionInSnippetNames = includer.options.includeFileExtensionInSnippetNames || false;
    includer.options.snippetSearchPaths = includer.options.snippetSearchPaths || ['tests/dummy/app'];
    includer.options.snippetRegexes = Object.assign({}, {
      begin: /{{#(?:docs-snippet|demo.example)\sname=(?:"|')(\S+)(?:"|')/,
      end: /{{\/(?:docs-snippet|demo.example)}}/,
    }, includer.options.snippetRegexes);
    includer.options.includehighlightJS = false;
    includer.options.includeHighlightStyle = false;
    includer.options.snippetExtensions = ['js', 'css', 'scss', 'hbs', 'md', 'text', 'json', 'handlebars', 'htmlbars', 'html', 'diff'];
    includer.options.autoImport = {
      exclude: [ 'qunit' ]
    };

    // This must come after we add our own options above, or else other addons won't see them.
    this._super.included.apply(this, arguments);

    const hasPlugins = this.project.addons.some(function(addon) {
      const isPlugin = addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin') !== -1;
      const isPluginPack = addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin-pack') !== -1;
      return isPlugin || isPluginPack;
    });

    if (!hasPlugins) {
      this.ui.writeWarnLine('ember-cli-addon-docs needs plugins to generate API documentation. You can install the default with `ember install ember-cli-addon-docs-yuidoc`');
    }

    this.addonOptions = Object.assign({}, includer.options['ember-cli-addon-docs']);
    this.addonOptions.projects = Object.assign({}, this.addonOptions.projects);

    let importer = findImporter(this);

    importer.import('vendor/lunr/lunr.js', {
      using: [{ transformation: 'amd', as: 'lunr' }]
    });
  },

  createDeployPlugin() {
    const AddonDocsDeployPlugin = require('./lib/deploy/plugin');
    return new AddonDocsDeployPlugin(this._readUserConfig());
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateCompiler = require('./lib/preprocessors/markdown-template-compiler');
      let ContentExtractor = require('./lib/preprocessors/hbs-content-extractor');
      registry.add('template', new TemplateCompiler());
      registry.add('template', new ContentExtractor(this.getBroccoliBridge()));
    }
  },

  contentFor(type) {
    if (type === 'body') {
      return fs.readFileSync(`${__dirname}/vendor/ember-cli-addon-docs/github-spa.html`, 'utf-8');
    }

    if (type === 'head-footer') {
      return `<link href="https://fonts.googleapis.com/css?family=Crimson+Text:400,600" rel="stylesheet">`;
    }
  },

  treeForApp(app) {
    let trees = [ app ];

    let addonPath = this.project.findAddonByName(this.name).root;
    let addonTree = new Funnel(path.join(addonPath, 'addon'), {
      include: ['**/*.js']
    });
    let autoExportedAddonTree = new AutoExportAddonToApp([ addonTree ]);
    trees.push(autoExportedAddonTree);

    return new MergeTrees(trees);
  },

  treeForAddon(tree) {
    let dummyAppFiles = new FindDummyAppFiles([ 'tests/dummy/app' ]);
    let addonFiles = new FindAddonFiles([ 'addon' ].filter(dir => fs.existsSync(dir)));

    return this._super(new MergeTrees([ tree, dummyAppFiles, addonFiles ]));
  },

  treeForAddonStyles(tree) {
    let trees = tree ? [ tree ] : [];

    trees.push(buildTailwind(this));

    return new MergeTrees(trees);
  },

  treeForVendor(vendor) {
    return new MergeTrees([
      vendor,
      // this._highlightJSTree(),
      this._lunrTree()
    ].filter(Boolean));
  },

  getBroccoliBridge() {
    if (!this._broccoliBridge) {
      const Bridge = require('broccoli-bridge');
      this._broccoliBridge = new Bridge();
    }
    return this._broccoliBridge;
  },

  postprocessTree(type, tree) {
    let parentAddon = this.parent.findAddonByName(this.parent.name());
    if (!parentAddon || type !== 'all') { return tree; }

    let PluginRegistry = require('./lib/models/plugin-registry');
    let DocsCompiler = require('./lib/broccoli/docs-compiler');
    let SearchIndexer = require('./lib/broccoli/search-indexer');

    let project = this.project;
    let docsTrees = [];

    this.addonOptions.projects.main = this.addonOptions.projects.main || generateDefaultProject(parentAddon);

    for (let projectName in this.addonOptions.projects) {
      let addonSourceTree = this.addonOptions.projects[projectName];

      let pluginRegistry = new PluginRegistry(project);

      let docsGenerators = pluginRegistry.createDocsGenerators(addonSourceTree, {
        destDir: 'docs',
        project,
        parentAddon
      });

      docsTrees.push(
        new DocsCompiler(docsGenerators, {
          name: projectName === 'main' ? parentAddon.name : projectName,
          project
        })
      );
    }

    let docsTree = new MergeTrees(docsTrees);

    let templateContentsTree = this.getBroccoliBridge().placeholderFor('template-contents');
    let searchIndexTree = new SearchIndexer(new MergeTrees([docsTree, templateContentsTree]), {
      outputFile: 'ember-cli-addon-docs/search-index.json',
      config: this.project.config(EmberApp.env())
    });

    return new MergeTrees([ tree, docsTree, searchIndexTree ]);
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

  _readUserConfig() {
    if (!this._userConfig) {
      const readConfig = require('./lib/utils/read-config');
      this._userConfig = readConfig(this.project);
    }

    return this._userConfig;
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

function generateDefaultProject(parentAddon) {
  let includeFunnels = [
    // We need to be very careful to avoid triggering a watch on the addon root here
    // because of https://github.com/nodejs/node/issues/15683
    new Funnel(new UnwatchedDir(parentAddon.root), {
      include: ['package.json', 'README.md']
    })
  ];

  let addonTreePath = path.join(parentAddon.root, parentAddon.treePaths['addon']);
  let testSupportPath = path.join(parentAddon.root, parentAddon.treePaths['addon-test-support']);

  if (fs.existsSync(addonTreePath)) {
    includeFunnels.push(new Funnel(addonTreePath, {
      destDir: parentAddon.name
    }));
  }

  if (fs.existsSync(testSupportPath)) {
    includeFunnels.push(new Funnel(testSupportPath, {
      destDir: `${parentAddon.name}/test-support`
    }));
  }

  return new MergeTrees(includeFunnels);
}

class FindDummyAppFiles extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];
    let paths = walkSync(addonPath, { directories: false })
    let pathsString = JSON.stringify(paths);

    fs.writeFileSync(path.join(this.outputPath, 'app-files.js'), `export default ${pathsString};`);
  }
}

class FindAddonFiles extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];
    let paths = addonPath ? walkSync(addonPath, { directories: false }) : [];
    let pathsString = JSON.stringify(paths);

    fs.writeFileSync(path.join(this.outputPath, 'addon-files.js'), `export default ${pathsString};`);
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
    [ 'adapters', 'controllers', 'helpers', 'models', 'routes', 'serializers', 'services', 'transitions' ].forEach(moduleType => {
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
