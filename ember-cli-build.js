'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    fingerprint: {
      prepend: '/ember-cli-addon-docs/',
    },
    svgJar: {
      sourceDirs: [
        'public',
        'tests/dummy/public'
      ]
    },
    'ember-cli-addon-docs': {
      includeTrees: ['app']
    }
  });

  return app.toTree();
};
