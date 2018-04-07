'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');

const Serializer = require('../serializers/main');

const compileMarkdown = require('../utils/compile-markdown');

function compileDescriptions(objects) {
  if (!objects) { return; }
  if (!Array.isArray(objects)) { objects = [objects]; }

  for (let object of objects) {
    if (object.description) {
      object.description = compileMarkdown(object.description);
    }
  }
}

const relationships = [
  'components',
  'classes',
  'functions',
  'variables',
  'methods',
  'fields',
  'accessors',
  'arguments'
];

function eachRelationship(collection, fn) {
  collection.forEach((item) => {
    relationships.forEach((key) => {
      if (item[key]) {
        fn(item[key], key);
      }
    });
  });
}

function removeHiddenDocs(modules) {
  eachRelationship(modules, (relationship) => {
    _.remove(relationship, (c) => c.tags.find((t) => t.name === 'hide' || t.name === 'hideDoc'));

    eachRelationship(relationship, (subRelationship) => {
      _.remove(subRelationship, (c) => c.tags.find((t) => t.name === 'hide' || t.name === 'hideDoc'));
    });
  });
}

function removeEmptyModules(modules) {
  _.remove(modules, (module) => {
    return (
      module.classes.length === 0
      && module.components.length === 0
      && module.functions.length === 0
      && module.variables.length === 0
    );
  });
}

function compileDocDescriptions(modules) {
  modules.forEach(compileDescriptions);

  eachRelationship(modules, (relationship) => {
    compileDescriptions(relationship);

    eachRelationship(relationship, compileDescriptions);
  });
}

function stripAppAddonDirs(modules) {

  modules.forEach((module) => {
    module.file = module.file.replace(/^(app|addon)/, '');
  });

  eachRelationship(modules, (relationship) => {
    relationship.forEach((item) => {
      if (item.file) item.file = item.file.replace(/^(app|addon)/, '');
      if (item.name) item.name = item.name.replace(/^(app|addon)/, '');
    });
  });
}

/**
 * "Hoists" default exports from a given module. This is particularly useful
 * for class files, which generally only export a single default class and
 * would normally look like this:
 *
 * /classes/foo
 *   FooClass
 * /classes/bar
 *   BarClass
 *
 * Instead they become this:
 *
 * /classes
 *   FooClass
 *   BarClass
 *
 * Since these are the only exports of that type and the default, users can
 * generally infer that they can import the class from the file with the same
 * name as the class or component (in many cases this also doesn't matter
 * since the affected classes will be resolved).
 *
 * If a file has named exports they will continue to appear in that module:
 *
 * /classes
 *   FooClass
 * /classes/foo
 *   HelperClass
 *
 * @param {Object} modules
 */
function hoistDefaults(modules) {
  for (let m in modules) {
    let module = modules[m];
    let parentModulePath = path.dirname(m);

    let value = _.remove(module, { isDefault: true });

    if (value) {
      modules[parentModulePath] = (modules[parentModulePath] || []).concat(value);
    }
  }

  // Remove any modules without exports now that hoisting is done
  for (let m in modules) {
    let module = modules[m];

    if (module.length === 0) {
      delete modules[m];
    }
  }

  return modules;
}



const RESOLVED_TYPES = [
  'components',
  'helpers',
  'controllers',
  'mixins',
  'models',
  'services'
];

function generateResolvedTypeNavigationItems(modules, type) {
  let items = modules.map(m => {
    let segments = m.file.split('/');
    let fileName = segments.pop();

    if (type.match(fileName)) {
      fileName = segments.pop();
    }

    let name;
    if (['components', 'helpers'].includes(type)) {
      name = `{{${fileName}}}`;
    } else {
      name = _.upperFirst(_.camelCase(fileName));
    }

    return {
      path: `${type}/${fileName}`,
      name
    };
  });

  return _.sortBy(items, ['name']);
}

function generateModuleNavigationItems(modules, type) {
  let navItems = modules.reduce((navItems, m) => {
    let items = m[type].map((item) => {
      return {
        path: `root/${item.id || module.id}`,
        name: item.name,
        isDefault: item.exportType === 'default'
      };
    });

    if (items.length > 0) {
        navItems[m.file] = _.sortBy(items, ['name']);
    }

    return navItems;
  }, {});

  return hoistDefaults(navItems);
}

function generateNavigationIndex(modules, klasses) {
  let navigationIndex = {};

  for (let type of RESOLVED_TYPES) {
    let resolvedModules = modules.filter(m => m.file.match(`${type}/`) && !m.file.match('utils/'));

    navigationIndex[type] = generateResolvedTypeNavigationItems(resolvedModules, type);
  }

  let nonResolvedModules = modules.filter(m => {
    return !m.file.match(new RegExp(`(${RESOLVED_TYPES.join('|')})/`)) || m.file.match('utils/');
  })

  navigationIndex.classes = generateModuleNavigationItems(nonResolvedModules, 'classes');
  navigationIndex.functions = generateModuleNavigationItems(nonResolvedModules, 'functions');
  navigationIndex.variables = generateModuleNavigationItems(nonResolvedModules, 'variables');

  for (let type in navigationIndex) {
    let items = navigationIndex[type];

    if (
      (Array.isArray(items) && items.length === 0)
      || (!Array.isArray(items) && Object.keys(items).length === 0)
    ) {
      delete navigationIndex[type];
    }
  }

  return navigationIndex;
}

module.exports = class DocsCompiler extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.json$/]
    };

    super(inputNodes, Object.assign(defaults, options));

    this.name = options.name;
    this.project = options.project;
  }

  build() {
    let name = this.name;
    let projectVersion = require(path.join(this.project.root, 'package.json')).version;
    let generatedDocs = this.inputPaths.map((p) => fs.readFileSync(path.join(p, 'docs/index.json'))).map(JSON.parse);

    let collectedDocs = generatedDocs.reduce((collected, payload) => {
      collected.data = collected.data.concat(payload.data);
      collected.included = collected.included.concat(payload.included);
      return collected;
    }, { data: [], included: [] });

    let modules = Serializer.deserialize('module', collectedDocs);

    removeHiddenDocs(modules);
    removeEmptyModules(modules);
    compileDocDescriptions(modules);
    stripAppAddonDirs(modules);

    let project = {
      id: name,
      name: name,
      version: projectVersion,
      navigationIndex: generateNavigationIndex(modules),
      modules
    }

    let baseDir = path.join(this.outputPath, 'docs', name);

    fs.ensureDirSync(baseDir);
    fs.writeJsonSync(path.join(baseDir + '.json'), Serializer.serialize('project', project));
  }
}
