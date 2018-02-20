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
    _.remove(relationship, (c) => c.tags.find((t) => t.tagName === '@hideDoc'));

    eachRelationship(relationship, (subRelationship) => {
      _.remove(subRelationship, (c) => c.tags.find((t) => t.tagName === '@hideDoc'));
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
    module.path = module.path.replace(/^\/(app|addon)/, '');
  });

  eachRelationship(modules, (relationship) => {
    relationship.forEach((item) => {
      if (item.file) item.file = item.file.replace(/^\/(app|addon)/, '');
      if (item.name) item.name = item.name.replace(/^\/(app|addon)/, '');
    });
  });
}

/**
 * "Hoist" pod modules so they don't appear in a super nested way, e.g.
 *
 * /components
 *   /foo-bar
 *     component.js <- This is a pod, colocated js, template, and styles
 *     template.hbs
 *     styles.scss
 *
 * Would normally become
 *
 * /components/foo-bar/component
 *   {{foo-bar}}
 *
 * In the nav bar, because it's module is the file that exports it. In
 * the case of certain types of pods, however, we can be sure that there
 * is only one JS file which is essentially the code for the entire pod.
 * In this case, it makes sense to remove the last module level for
 * navigation purposes:
 *
 * /components/foo-bar
 *   {{foo-bar}}
 *
 * We then do one more level of hoisting (see hoistDefaults) to clean
 * up the navigation even more.
 *
 * @param {Object} modules
 */
function hoistComponentPods(modules) {
  for (let m in modules) {
    let module = modules[m];

    if (path.basename(module.path) === 'component') {
      let parentModulePath = path.dirname(module.path);

      modules[parentModulePath] = modules[parentModulePath] || {
        path: parentModulePath,
        components: [],
        classes: [],
        functions: [],
        variables: []
      };

      modules[parentModulePath].components.push(module.components.pop());

      if (
        module.components.length === 0
        && module.classes.length === 0
        && module.functions.length === 0
        && module.variables.length === 0
      ) {
        delete modules[m];
      }
    }
  }
}

/**
 * "Hoists" default exports from a given module. This is particularly useful
 * for class files, which generally only export a single default class and
 * would normally look like this:
 *
 * /components/foo-component
 *   {{foo-component}}
 * /components/bar-component
 *   {{bar-component}}
 *
 * Instead they become this:
 *
 * /components
 *   {{foo-component}}
 *   {{bar-component}}
 *
 * Since these are the only exports of that type and the default, users can
 * generally infer that they can import the class from the file with the same
 * name as the class or component (in many cases this also doesn't matter
 * since the affected classes will be resolved).
 *
 * If a file has named exports they will continue to appear in that module:
 *
 * /components
 *   {{foo-component}}
 * /components/foo-component
 *   [func] utilityFunction
 *   [var] constantValue
 *   [class] HelperClass
 *
 * @param {Object} modules
 */
function hoistDefaults(modules) {
  for (let m in modules) {
    let module = modules[m];
    let parentModulePath = path.dirname(module.path);

    // Find or create the module
    modules[parentModulePath] = modules[parentModulePath] || {
      path: parentModulePath,
      components: [],
      classes: [],
      functions: [],
      variables: []
    };

    let parentModule = modules[parentModulePath];

    for (let key of ['components', 'classes', 'functions', 'variables']) {
      let [value] = _.remove(module[key], { isDefault: true });

      if (value) {
        parentModule[key].push(value);
      }
    }
  }

  // Remove any modules without exports now that hoisting is done
  for (let m in modules) {
    let module = modules[m];
    if (
      module.components.length === 0
      && module.classes.length === 0
      && module.functions.length === 0
      && module.variables.length === 0
    ) {
      delete modules[m];
    }
  }
}

function generateNavigationIndex(modules) {
  let moduleMap = modules.reduce((map, m) => {
    let path = m.path;

    let components = m.components.map((c) => {
      let segments = m.path.split('/');
      let fileName = segments.pop();

      if (fileName === 'component') {
        fileName = segments.pop();
      }

      return {
        id: c.id,
        path: fileName,
        isDefault: c.exportType === 'default'
      };
    });

    let classes = m.classes.map((c) => {
      return {
        id: c.id,
        name: c.name,
        isDefault: c.exportType === 'default'
      };
    });

    let functions = m.functions.map((f) => {
      return {
        moduleId: m.id,
        name: f.name,
        isDefault: f.exportType === 'default'
      }
    });

    let variables = m.variables.map((v) => {
      return {
        moduleId: m.id,
        name: v.name,
        isDefault: v.exportType === 'default'
      }
    });

    map[path] = { path,
      components: _.sortBy(components, ['path']),
      classes: _.sortBy(classes, ['name']),
      functions: _.sortBy(functions, ['name']),
      variables: _.sortBy(variables, ['name'])
    };

    return map;
  }, {});

  hoistComponentPods(moduleMap);
  hoistDefaults(moduleMap);

  let navigationIndex = [];

  for (let path in moduleMap) {
    navigationIndex.push(moduleMap[path]);
  }

  return _.sortBy(navigationIndex, ['path']);
}

module.exports = class DocsCompiler extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.json$/]
    };

    super(inputNodes, Object.assign(defaults, options));

    this.project = options.project;
    this.parentAddon = options.parentAddon;
  }

  build() {
    let { parentAddon } = this;
    let generatedDocs = this.inputPaths.map((p) => fs.readFileSync(path.join(p, 'docs/index.json'))).map(JSON.parse);

    let collectedDocs = generatedDocs.reduce((collected, payload) => {
      collected.data.push(...payload.data);
      collected.included.push(...payload.included);
      return collected;
    }, { data: [], included: [] });

    let modules = Serializer.deserialize('module', collectedDocs);

    removeHiddenDocs(modules);
    removeEmptyModules(modules);
    compileDocDescriptions(modules);
    stripAppAddonDirs(modules);

    let project = {
      id: parentAddon.name,
      name: parentAddon.name,
      navigationIndex: generateNavigationIndex(modules),
      modules
    }

    let baseDir = path.join(this.outputPath, 'docs');

    fs.ensureDirSync(baseDir);
    fs.writeJsonSync(path.join(baseDir, 'index.json'), Serializer.serialize('project', project));
  }
}
