/* eslint-env node */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const stringUtil = require('ember-cli-string-utils');
const EmberRouterGenerator = require('ember-router-generator');

const DUMMY_APP_PATH = path.join('tests', 'dummy', 'app');

function dedasherize(str) {
  let dedasherized = str.replace(/-/g, ' ');

  return stringUtil.capitalize(dedasherized);
}

module.exports = {
  name: 'docs-page',
  description: 'Generates an ember-cli-addon-docs doc page',

  fileMapTokens: function() {
    return {
      __templatepath__: function(options) {
        if (options.pod) {
          return path.join(
            DUMMY_APP_PATH,
            'pods',
            'docs',
            options.dasherizedModuleName
          );
        } else {
          return path.join(DUMMY_APP_PATH, 'templates', 'docs');
        }
      },
      __templatename__: function(options) {
        if (options.pod) {
          return 'template';
        }
        return options.dasherizedModuleName;
      }
    };
  },

  locals: function(options) {
    return {
      templateName: dedasherize(options.entity.name)
    };
  },

  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);
  },

  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};

function updateRouter(action, options) {
  let entity = options.entity;
  let actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  let color = actionColorMap[action] || 'gray';

  writeRoute(action, entity.name, options);

  this.ui.writeLine('updating router');
  this._writeStatusToUI(chalk[color], action + ' route', entity.name);
}

function findRouter(options) {
  let routerPathParts = [].concat([
    options.project.root,
    DUMMY_APP_PATH,
    'router.js'
  ]);

  return routerPathParts;
}

function writeRoute(action, name, options) {
  let routerPath = path.join.apply(null, findRouter(options));
  let source = fs.readFileSync(routerPath, 'utf-8');

  let routes = new EmberRouterGenerator(source);
  let newRoutes = routes[action](name, options);

  fs.writeFileSync(routerPath, newRoutes.code());
}
