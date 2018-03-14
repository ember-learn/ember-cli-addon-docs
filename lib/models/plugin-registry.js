'use strict';

const DocsFilter = require('../broccoli/docs-filter');

function isPluginPack(addon) {
  return addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin-pack') !== -1;
}

function isPlugin(addon) {
  return addon.pkg.keywords.indexOf('ember-cli-addon-docs-plugin') !== -1;
}

class PluginRegistry {
  constructor(project) {
    this.project = project;

    this._plugins = null;
    this._docsGenerators = null;
  }

  get plugins() {
    if (this._plugins === null) {
      this._plugins = this._discoverPlugins(this.project.addons || []);
    }

    return this._plugins;
  }

  createDocsGenerators(inputTree, options) {
    if (this._docsGenerators === null) {
      this._docsGenerators = this.plugins.map(p => p.createDocsGenerator(
        new DocsFilter(inputTree, p.name.replace('ember-cli-addon-docs-', '')),
        options
      ));
    }

    return this._docsGenerators;
  }

  _discoverPlugins(addons) {
    return addons.reduce((plugins, addon) => {
      if (isPlugin(addon)) {
        plugins.push(addon);
      } else if (isPluginPack(addon)) {
        plugins = plugins.concat(this._discoverPlugins(addon.addons));
      }

      return plugins;
    }, []);
  }
}

module.exports = PluginRegistry;
