'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Project = require('ember-cli/lib/models/project');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let project = Project.closestSync(process.cwd());

  project.pkg['ember-addon'].paths = ['sandbox'];

  defaults.project = project;

  var app = new EmberAddon(defaults, {
    project,
    vendorFiles: { 'jquery.js': null, 'app-shims.js': null },

    // Workaround for https://github.com/ember-cli/ember-cli/issues/8075
    'ember-cli-uglify': {
      uglify: {
        compress: {
          collapse_vars: false
        }
      }
    },

    'ember-cli-addon-docs': {
      projects: {
        sandbox: new MergeTrees([
          new Funnel('sandbox/app', { destDir: 'sandbox' }),
          new Funnel('sandbox', {
            include: ['package.json', 'README.md']
          })
        ])
      }
    },
    postcssOptions: {
      compile: {
        enabled: false,
      },

      filter: {
        enabled: false,
        plugins: []
      },
    },
  });

  return app.toTree();
};
