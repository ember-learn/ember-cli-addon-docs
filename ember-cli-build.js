/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    fingerprint: {
      prepend: '/ember-cli-addon-docs/',
    },
    svgJar: {
      sourceDirs: ['tests/dummy/public']
    }
  });

  return app.toTree();
};
