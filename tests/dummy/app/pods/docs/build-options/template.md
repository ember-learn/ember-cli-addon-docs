# Build options

To override the default configuration of the addon, use the following options in your `ember-cli-build.js`.

## snippetExtensions

Override the default file extensions where [ember-code-snippet](https://github.com/ef4/ember-code-snippet) looks for snippets.

### Default:

`['js','ts','coffee','html','hbs','md','css','sass','scss','less','emblem','yaml']`

### How to use it

{{#docs-snippet name='build-options-snippet-extensions.js' title='app/ember-cli-build.js'}}
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
{{/docs-snippet}}





