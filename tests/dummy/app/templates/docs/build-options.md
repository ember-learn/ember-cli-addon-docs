# Build options

To override the default configuration of the addon, use the following options in your `ember-cli-build.js`.

## Static site generation (prember)

AddonDocs uses [prember](https://github.com/ef4/prember) and [FastBoot](https://github.com/ember-fastboot/ember-cli-fastboot) to pre-render your documentation as static HTML. This gives you faster initial page loads and better SEO.

Both `ember-cli-fastboot` and `prember` are installed automatically when you run `ember install ember-cli-addon-docs`. Prember is configured automatically — all your documentation pages (guides and API docs) are discovered from the build output and pre-rendered as static HTML files. No manual configuration is needed.

If you need to customize which URLs are pre-rendered, you can override the prember config in your `ember-cli-build.js`:

<DocsSnippet @name="build-options-prember.js" @title="app/ember-cli-build.js">
  const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

  module.exports = function(defaults) {
    let app = new EmberAddon(defaults, {
      prember: {
        urls({ distDir }) {
          let defaultUrls = require('ember-cli-addon-docs/lib/prember-urls')({ distDir });
          return [...defaultUrls, '/my-custom-page'];
        },
      },
    });

    return app.toTree();
  };
</DocsSnippet>

## snippetExtensions

Override the default file extensions where [ember-code-snippet](https://github.com/ef4/ember-code-snippet) looks for snippets.

### Default:

`['js','ts','coffee','html','hbs','md','css','sass','scss','less','emblem','yaml']`

### How to use it

<DocsSnippet @name="build-options-snippet-extensions.js" @title="app/ember-cli-build.js">
  /* global require, module */
  const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

  module.exports = function(defaults) {
    let app = new EmberAddon(defaults, {
      // More config options of your app here

      snippetExtensions: ['js','ts','coffee','html','hbs','md','css','sass','scss','less','emblem','yaml'],

      // More config options of your app here
    });

    return app.toTree();
  };
</DocsSnippet>





