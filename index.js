'use strict';

const fs = require('fs');
const path = require('path');
const UnwatchedDir = require('broccoli-source').UnwatchedDir;
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line n/no-unpublished-require
const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');

const LATEST_VERSION_NAME = '-latest';
const styleDir = path.join(__dirname, 'addon', 'styles');

module.exports = {
  name: require('./package').name,

  LATEST_VERSION_NAME,

  options: {
    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              includePaths: [styleDir],
            },
          },
          require('tailwindcss')(
            path.join(__dirname, 'addon', 'styles', 'tailwind.config.js'),
          ),
        ],
      },
    },

    svgJar: {
      sourceDirs: ['public', `${__dirname}/public`, 'tests/dummy/public'],
      optimizer: {
        plugins: [
          {
            removeAttrs: {
              attrs: ['fill'],
            },
          },
        ],
      },
    },
  },

  config(env, baseConfig) {
    let pkg = this.parent.pkg;
    if (this._documentingAddonAt()) {
      pkg = require(path.join(this._documentingAddonAt(), 'package.json'));
    }

    let repo = pkg.repository;
    let info = require('hosted-git-info').fromUrl(repo.url || repo);
    let userConfig = this._readUserConfig();

    let docsAppPathInRepo = path.relative(
      this._getRepoRoot(),
      path.join(
        path.resolve(path.dirname(this.project.configPath()), '..'),
        'app',
      ),
    );

    let addonPathInRepo = this._documentingAddonAt()
      ? path.relative(
          this._getRepoRoot(),
          path.join(this._documentingAddonAt(), this._addonSrcFolder()),
        )
      : path.relative(
          this._getRepoRoot(),
          path.join(this.project.root, this._addonSrcFolder()),
        );

    let config = {
      'ember-cli-addon-docs': {
        projectName: pkg.name,
        projectDescription: pkg.description,
        projectTag: pkg.version,
        projectHref: info && info.browse(),
        docsAppPathInRepo,
        addonPathInRepo,
        primaryBranch: userConfig.getPrimaryBranch(),
        latestVersionName: LATEST_VERSION_NAME,
        deployVersion: 'ADDON_DOCS_DEPLOY_VERSION',
        searchTokenSeparator: '\\s+',
        showImportPaths: true,
      },
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
      throw new Error(
        `ember-cli-addon-docs should be in your package.json's devDependencies`,
      );
    } else if (includer.name === this.project.name()) {
      if (this._documentingAddonAt()) {
        // we're being used in a standalone documentation app that documents an
        // addon but is not that addon's dummy app.
      } else {
        throw new Error(
          `to use ember-cli-addon-docs in an application (as opposed to an addon) you must set documentingAddonAt`,
        );
      }
    }

    includer.options.includeFileExtensionInSnippetNames =
      includer.options.includeFileExtensionInSnippetNames || false;
    if (!includer.options.snippetSearchPaths) {
      if (this._documentingAddonAt()) {
        // we are a standalone app, so our code is here
        includer.options.snippetSearchPaths = ['app'];
      } else {
        // we are inside the addon, so our code is here
        includer.options.snippetSearchPaths = ['tests/dummy/app'];
      }
    }

    if (!includer.options.snippetRegexes) {
      includer.options.snippetRegexes = [
        {
          begin: /{{#(?:docs-snippet|demo\.example)\s+name=['"](\S+)['"]/,
          end: /{{\/(?:docs-snippet|demo\.example)}}/,
        },
        {
          begin:
            /<(?:DocsSnippet|demo\.example)\s+@name=['"](\S+)['"].*(?<!\/)>/,
          end: /<\/(?:DocsSnippet|demo\.example)>/,
        },
      ];
    }

    let snippetExtensions = includer.options.snippetExtensions;

    if (!Array.isArray(includer.options.snippetExtensions)) {
      snippetExtensions = [
        'ts',
        'js',
        'css',
        'scss',
        'hbs',
        'md',
        'text',
        'json',
        'handlebars',
        'htmlbars',
        'html',
        'diff',
      ];
    }

    includer.options.snippetExtensions = snippetExtensions;

    // This must come after we add our own options above, or else other addons won't see them.
    this._super.included.apply(this, arguments);

    const hasPlugins = this.project.addons.some(function (addon) {
      const isPlugin =
        addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin') !== -1;
      const isPluginPack =
        addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin-pack') !== -1;
      return isPlugin || isPluginPack;
    });

    if (!hasPlugins) {
      this.ui.writeWarnLine(
        'ember-cli-addon-docs needs plugins to generate API documentation. You can install the default with `ember install ember-cli-addon-docs-yuidoc`',
      );
    }

    this.addonOptions = Object.assign(
      {},
      includer.options['ember-cli-addon-docs'],
    );
    this.addonOptions.projects = Object.assign({}, this.addonOptions.projects);

    let importer = findImporter(this);

    importer.import('vendor/lunr/lunr.js', {
      using: [{ transformation: 'amd', as: 'lunr' }],
    });
  },

  createDeployPlugin() {
    const AddonDocsDeployPlugin = require('./lib/deploy/plugin');
    return new AddonDocsDeployPlugin(this._readUserConfig());
  },

  contentFor(type) {
    if (type === 'body') {
      return fs.readFileSync(
        `${__dirname}/vendor/ember-cli-addon-docs/github-spa.html`,
        'utf-8',
      );
    }
  },

  treeForAddon(tree) {
    let dummyAppFiles = new FindDummyAppFiles([this.app.trees.app]);
    let addonToDocument = this._documentingAddon();
    let addonFiles = new FindAddonFiles(
      [path.join(addonToDocument.root, this._addonSrcFolder())].filter((dir) =>
        fs.existsSync(dir),
      ),
    );
    return this._super(new MergeTrees([tree, dummyAppFiles, addonFiles]));
  },

  treeForVendor(vendor) {
    return new MergeTrees([vendor, this._lunrTree()].filter(Boolean));
  },

  getBroccoliBridge() {
    if (!this._broccoliBridge) {
      const Bridge = require('broccoli-bridge');
      this._broccoliBridge = new Bridge();
    }
    return this._broccoliBridge;
  },

  treeForApp(tree) {
    if (!this._appTree) {
      let { app, templates } = this.app.trees;
      let appTree = new MergeTrees([new Funnel(app), new Funnel(templates)], {
        overwrite: true,
        annotation: 'app md & templates',
      });
      let TemplateCompiler = require('./lib/preprocessors/markdown-template-compiler');
      const templateCompiler = new TemplateCompiler();
      appTree = templateCompiler.toTree(appTree);
      appTree = new Funnel(appTree, {
        include: [/.*\.hbs/],
        annotation: 'app templates',
      });
      this._appTree = this._super(new MergeTrees([tree, appTree]));
    }
    return this._appTree;
  },

  treeForPublic(tree) {
    let addonToDocument = this._documentingAddon();
    if (!addonToDocument) {
      return tree;
    }

    let ContentExtractor = require('./lib/preprocessors/hbs-content-extractor');
    let appTree = this._treeFor('app');
    const contentExtractor = new ContentExtractor(this.getBroccoliBridge());
    contentExtractor.toTree(appTree);

    let PluginRegistry = require('./lib/models/plugin-registry');
    let DocsCompiler = require('./lib/broccoli/docs-compiler');
    let SearchIndexer = require('./lib/broccoli/search-indexer');

    let project = this.project;
    let docsTrees = [];
    this.addonOptions.projects.main =
      this.addonOptions.projects.main ||
      generateDefaultProject(addonToDocument, this._addonSrcFolder());

    for (let projectName in this.addonOptions.projects) {
      let addonSourceTree = this.addonOptions.projects[projectName];

      let pluginRegistry = new PluginRegistry(project);

      let docsGenerators = pluginRegistry.createDocsGenerators(
        addonSourceTree,
        {
          destDir: 'docs',
          project,
          parentAddon: addonToDocument,
        },
      );

      docsTrees.push(
        new DocsCompiler(docsGenerators, {
          name: projectName === 'main' ? addonToDocument.name : projectName,
          project,
        }),
      );
    }

    let docsTree = new MergeTrees(docsTrees, { annotation: 'docsTrees' });

    let templateContentsTree =
      this.getBroccoliBridge().placeholderFor('template-contents');
    let searchIndexTree = new SearchIndexer(
      new MergeTrees([docsTree, templateContentsTree], {
        annotation: 'SearchIndexer',
      }),
      {
        outputFile: 'ember-cli-addon-docs/search-index.json',
        config: this.project.config(EmberApp.env()),
      },
    );
    return new MergeTrees([this._super(tree), searchIndexTree, docsTree], {
      annotation: 'this._super(tree), docsTree',
    });
  },

  _lunrTree() {
    return new Funnel(path.dirname(require.resolve('lunr/package.json')), {
      destDir: 'lunr',
    });
  },

  _readUserConfig() {
    if (!this._userConfig) {
      const readConfig = require('./lib/utils/read-config');
      this._userConfig = readConfig(this.project);
    }

    return this._userConfig;
  },

  _getRepoRoot() {
    if (!this._repoRoot) {
      this._repoRoot = require('git-repo-info')().root;
    }
    return this._repoRoot;
  },

  // returns the absolute path to the addon we're documenting when
  // ember-cli-addon-docs is being used by an *app* (not an addon) that has
  // explicitly set `documentingAddonAt`.
  _documentingAddonAt() {
    if (this._cachedDocumentingAddonAt === undefined && this.app) {
      if (
        this.app.options['ember-cli-addon-docs'] &&
        this.app.options['ember-cli-addon-docs'].documentingAddonAt
      ) {
        this._cachedDocumentingAddonAt = path.resolve(
          this.project.root,
          this.app.options['ember-cli-addon-docs'].documentingAddonAt,
        );
      } else {
        this._cachedDocumentingAddonAt = null;
      }
    }
    return this._cachedDocumentingAddonAt;
  },

  // returns path of the addon source code relative to the addon root folder.
  _addonSrcFolder() {
    if (this._cachedAddonSrcFolder === undefined) {
      if (
        this.app &&
        this.app.options['ember-cli-addon-docs'] &&
        this.app.options['ember-cli-addon-docs'].addonSrcFolder
      ) {
        this._cachedAddonSrcFolder =
          this.app.options['ember-cli-addon-docs'].addonSrcFolder;
      } else {
        let pkg = this.parent.pkg;
        if (this._documentingAddonAt()) {
          pkg = require(path.join(this._documentingAddonAt(), 'package.json'));
        }
        this._cachedAddonSrcFolder =
          pkg['ember-addon'].version === 2 ? 'src' : 'addon';
      }
    }
    return this._cachedAddonSrcFolder;
  },

  _documentingAddon() {
    let addon;
    if (this._documentingAddonAt()) {
      addon = this.project.addons.find(
        (a) => a.root === this._documentingAddonAt(),
      );
      if (!addon) {
        throw new Error(
          `You set documentingAddonAt to point at ${this._documentingAddonAt()} but that addon does not appear to be present in this app.`,
        );
      }
    } else {
      addon = this.parent.findAddonByName(this.parent.name());
    }
    return addon;
  },
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

function generateDefaultProject(parentAddon, addonSrcFolder) {
  let includeFunnels = [
    // We need to be very careful to avoid triggering a watch on the addon root here
    // because of https://github.com/nodejs/node/issues/15683
    new Funnel(new UnwatchedDir(parentAddon.root), {
      include: ['package.json', 'README.md'],
    }),
  ];

  let addonTreePath = path.join(parentAddon.root, addonSrcFolder);
  let testSupportPath = path.join(
    parentAddon.root,
    parentAddon.treePaths['addon-test-support'],
  );

  if (fs.existsSync(addonTreePath)) {
    includeFunnels.push(
      new Funnel(addonTreePath, {
        destDir: parentAddon.name,
      }),
    );
  }

  if (fs.existsSync(testSupportPath)) {
    includeFunnels.push(
      new Funnel(testSupportPath, {
        destDir: `${parentAddon.name}/test-support`,
      }),
    );
  }

  return new MergeTrees(includeFunnels);
}

class FindDummyAppFiles extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];
    let paths = walkSync(addonPath, { directories: false });
    let pathsString = JSON.stringify(paths);

    fs.writeFileSync(
      path.join(this.outputPath, 'app-files.js'),
      `export default ${pathsString};`,
    );
  }
}

class FindAddonFiles extends Plugin {
  build() {
    let addonPath = this.inputPaths[0];
    let paths = addonPath ? walkSync(addonPath, { directories: false }) : [];
    let pathsString = JSON.stringify(paths);

    fs.writeFileSync(
      path.join(this.outputPath, 'addon-files.js'),
      `export default ${pathsString};`,
    );
  }
}
