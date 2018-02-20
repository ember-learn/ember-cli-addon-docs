function isPluginPack(addon) {
  return addon.pkg.keywords.includes('ember-cli-addon-docs-plugin-pack');
}

function isPlugin(addon) {
  return addon.pkg.keywords.includes('ember-cli-addon-docs-plugin');
}

class PluginRegistry {
  constructor({ project }) {
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
      let { plugins } = this;

      this._docsGenerators = plugins.map(p => p.createDocsGenerator(
        inputTree,
        options
      ));
    }

    return this._docsGenerators;
  }

  _discoverPlugins(addons) {
    return addons.reduce((plugins, addon) => {
      if (isPlugin(addon)) {
        plugins.push(addon);
      } else if (isPluginPack) {
        plugins.push(...this._discoverPlugins(addon.addons));
      }

      return plugins;
    }, []);
  }
}

module.exports = PluginRegistry;
