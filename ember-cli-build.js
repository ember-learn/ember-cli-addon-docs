/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    fingerprint: {
      prepend: '/ember-cli-addon-docs/',
    },
    snippetSearchPaths: ['tests/dummy/app'],
    snippetRegexes: {
      begin: /{{#(?:docs-snippet|demo.example|demo.live-example)\sname=(?:\"|\')(\S+)(?:\"|\')/,
      end: /{{\/(?:docs-snippet|demo.example|demo.live-example)}}/,
    },
    svgJar: {
      sourceDirs: ['tests/dummy/public']
    }
  });

  return app.toTree();
};
