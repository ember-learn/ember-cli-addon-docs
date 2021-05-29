'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Project = require('ember-cli/lib/models/project');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

const path = require('path');
const styleDir = path.join(__dirname, 'addon', 'styles');

module.exports = function (defaults) {
  let project = Project.closestSync(process.cwd());

  project.pkg['ember-addon'].paths = ['sandbox'];

  defaults.project = project;

  var app = new EmberAddon(defaults, {
    project,
    vendorFiles: { 'jquery.js': null, 'app-shims.js': null },

    // Workaround for https://github.com/ember-cli/ember-cli/issues/8075
    'ember-cli-terser': {
      terser: {
        compress: {
          collapse_vars: false,
        },
      },
    },

    'ember-cli-addon-docs': {
      projects: {
        sandbox: new MergeTrees([
          new Funnel('sandbox/app', { destDir: 'sandbox' }),
          new Funnel('sandbox', {
            include: ['package.json', 'README.md'],
          }),
        ]),
      },
    },
    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              includePaths: [styleDir],
            },
          },
        ],
      },
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
