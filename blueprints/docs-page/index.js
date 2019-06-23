/* eslint-env node */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const padStart = require('pad-start');
const EmberRouterGenerator = require('ember-router-generator');
const stringUtil = require('ember-cli-string-utils');

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
    updateDocsTemplate.call(this, options);
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

  if (entity.name === 'index') {
    return;
  }

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

function updateDocsTemplate(options) {
  let routeName = options.entity.name;
  let docsTemplatePath = options.pod
    ? path.join(DUMMY_APP_PATH, 'pods', 'docs', 'template.hbs')
    : path.join(DUMMY_APP_PATH, 'templates', 'docs.hbs');

  if (fs.existsSync(docsTemplatePath)) {
    let templateLines = fs
      .readFileSync(docsTemplatePath, 'utf-8')
      .toString()
      .split('\n');

    let closingViewerNavTag = templateLines.find(line =>
      line.includes('{{/viewer.nav}}') || line.includes('</viewer.nav>')
    );

    templateLines.splice(
      templateLines.indexOf(closingViewerNavTag),
      0,
      `${padStart(
        '',
        closingViewerNavTag.search(/\S/) * 2,
        ' '
      )}{{nav.item "${dedasherize(routeName)}" "docs.${routeName}"}}`
    );

    fs.writeFileSync(docsTemplatePath, templateLines.join('\n'));

    this.ui.writeLine('updating docs.hbs');
    this._writeStatusToUI(chalk.green, 'add nav item', 'docs.hbs');
  }
}
