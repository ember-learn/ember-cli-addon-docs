'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');

const Serializer = require('../serializers/main');

const compileMarkdown = require('../utils/compile-markdown');
const NavigationIndexGenerator = require('./docs-compiler/navigation-index-generator');

function compileDescriptions(objects, options = {}) {
  let { templateCompiler } = options;

  if (!objects) { return; }
  if (!Array.isArray(objects)) { objects = [objects]; }

  for (let object of objects) {
    if (object.description) {
      object.description = compileMarkdown(object.description, { targetHandlebars: true });

      if (templateCompiler) {
        object.htmlbars = templateCompiler.precompile(object.description);
      }
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

function eachRelationship(collection, fn, options = {}) {
  let { templateCompiler } = options;

  collection.forEach((item) => {
    relationships.forEach((key) => {
      if (item[key]) {
        fn(item[key], key, { templateCompiler });
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

function compileDocDescriptions(modules, options = {}) {
  let { templateCompiler } = options;

  modules.forEach(module => compileDescriptions(module, { templateCompiler }));

  eachRelationship(modules, (relationship) => {
    compileDescriptions(relationship, { templateCompiler });

    eachRelationship(relationship, compileDescriptions, { templateCompiler });
  });
}

module.exports = class DocsCompiler extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.json$/]
    };

    super(inputNodes, Object.assign(defaults, options));

    this.name = options.name;
    this.project = options.project;
    this.templateCompiler = options.templateCompiler;
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
    compileDocDescriptions(modules, {
      templateCompiler: this.templateCompiler
    });

    let project = {
      id: name,
      name: name,
      version: projectVersion,
      navigationIndex: (new NavigationIndexGenerator).generate(modules),
      modules
    }

    let baseDir = path.join(this.outputPath, 'docs', name);

    fs.ensureDirSync(baseDir);
    fs.writeJsonSync(path.join(baseDir + '.json'), Serializer.serialize('project', project));
  }
}
