'use strict';

const Writer = require('broccoli-caching-writer');
const lunr = require('lunr');
const striptags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities;
const fs = require('fs-extra');
const path = require('path');

const htmlEntities = new Entities();

module.exports = class SearchIndexCompiler extends Writer {
  constructor(input, options) {
    super([input]);
    this.config = options.config;
    this.outputFile = options.outputFile;
  }

  build() {
    let writer = this;
    let documents = {};
    let index = lunr(function() {
      this.ref('id');
      this.metadataWhitelist = ['position'];

      this.field('title');
      this.field('text');
      this.field('keywords');

      this.tokenizer.separator = new RegExp(writer.config['ember-cli-addon-docs'].searchTokenSeparator);

      for (let doc of writer.buildDocuments()) {
        if (doc) {
          documents[doc.id] = doc;
          this.add(doc);
        }
      }
    });

    let destFile = path.join(this.outputPath, this.outputFile);
    let output = { index: index.toJSON(), documents };
    fs.ensureDirSync(path.dirname(destFile));
    fs.writeJsonSync(destFile, output);
  }

  *buildDocuments() {
    for (let filePath of this.listFiles()) {
      if (/\.template-contents$/.test(filePath)) {
        yield this.buildTemplateDocument(filePath);
      } else if (/\/project-versions\/[^/]+\.json$/.test(filePath)) {
        yield* this.buildClassDocuments(filePath);
      }
    }
  }

  buildTemplateDocument(filePath) {
    let relativePath = filePath.replace(this.inputPaths[0] + '/', '');
    let contents = fs.readJsonSync(filePath, 'utf-8');

    // This will need to change for module unification...
    let modulePrefix = this.config.modulePrefix;
    let podModulePrefix = this.config.podModulePrefix || modulePrefix;

    let routePath;
    if (relativePath.indexOf(podModulePrefix) === 0 && POD_TEMPLATE_REGEX.test(relativePath)) {
      routePath = relativePath.replace(`${podModulePrefix}/`, '').replace(POD_TEMPLATE_REGEX, '');
    } else if (relativePath.indexOf(modulePrefix) === 0 && /\.template-contents$/.test(relativePath)) {
      routePath = relativePath.replace(`${modulePrefix}/templates/`, '').replace(/\.template-contents$/, '');
    }

    if (routePath && routePath.indexOf('components/') !== 0) {
      return {
        id: `template:${routePath}`,
        type: 'template',
        title: normalizeText(contents.title),
        text: normalizeText(contents.body),
        route: routePath.replace(/\//g, '.'),
        keywords: [], // TODO allow for specifying keywords
      };
    }
  }

  *buildClassDocuments(filePath) {
    let projectVersionDoc = fs.readJsonSync(filePath, 'utf-8');
    for (let item of projectVersionDoc.included) {
      if (item.type !== 'class') { continue; }

      let keywords = [];
      for (let method of item.attributes.methods) {
        keywords.push(method.name);
      }

      for (let property of item.attributes.properties) {
        keywords.push(property.name);
      }

      yield {
        id: `class:${item.id}`,
        type: 'class',
        title: item.attributes.name,
        text: htmlEntities.decode(striptags(normalizeText(item.attributes.description))),
        keywords: keywords,
        class: item
      };
    }
  }
}

const POD_TEMPLATE_REGEX = /\/template\.template-contents$/;

function normalizeText(text) {
  if (!text) { return text; }
  return text.replace(/\s+/g, ' ');
}
