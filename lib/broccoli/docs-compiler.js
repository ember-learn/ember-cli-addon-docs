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
    segments = segments.slice(segments.indexOf(type) + 1);

    if (type.match(segments[segments.length - 1])) {
      segments.pop();
    }

    let path = segments.join('/');
    let name;

    if (['components', 'helpers'].includes(type)) {
      name = `{{${path}}}`;
    } else {
      let fileName = segments.pop();
      name = _.upperFirst(_.camelCase(fileName));
    }

    return {
      path: `${type}/${path}`,
      name
    };
  });

  return _.sortBy(items, ['path']);
}

function generateNavigationIndex(modules, klasses) {
  let navigationIndex = {};

  for (let type of RESOLVED_TYPES) {
    let resolvedModules = modules.filter(m => m.file.match(`${type}/`) && !m.file.match('utils/'));

    navigationIndex[type] = generateResolvedTypeNavigationItems(resolvedModules, type);
  }

  navigationIndex.modules = modules
    .filter(m => {
      return (
        !m.file.match(new RegExp(`(${RESOLVED_TYPES.join('|')})/`)) ||
        m.file.match('utils/')
      );
    })
    .map(m => {
      return {
        path: `modules/${m.id}`,
        name: m.id
      };
    });


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
