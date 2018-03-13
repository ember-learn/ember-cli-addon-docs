'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Project = require('ember-cli/lib/models/project');

module.exports = function(defaults) {
  let project = Project.closestSync(process.cwd());

  project.pkg['ember-addon'].paths = ['sandbox'];

  defaults.project = project;

  var app = new EmberAddon(defaults, {
    project,
    svgJar: {
      sourceDirs: [
        'public',
        'tests/dummy/public'
      ]
    },
    'ember-cli-addon-docs': {
      projects: {
        sandbox: {
          tree: 'sandbox'
        }
      }
    }
  });

  return app.toTree();
};
