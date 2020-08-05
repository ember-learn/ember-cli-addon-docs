'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Project = require('ember-cli/lib/models/project');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const preprocess = require('broccoli-preprocess-tree');

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
      }
    }
  });

  let appTree = new Funnel(app.toTree(), {
    exclude: ['addon/styles']
  });

  let styles = preprocess('addon/styles', {
    context: {
      NO_BASE_STYLES: true
    },
    destDir: 'addon/styles'
  });

  styles = new Funnel(styles, { destDir: 'addon/styles' });

  appTree = new MergeTrees([appTree, styles]);

  return appTree;
};
