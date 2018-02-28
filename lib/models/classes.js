'use strict';

const Document = require('./base-classes/document');
const flattenParams = require('./utils/flatten-params');

class Class extends Document {
  constructor(doc) {
    super(doc);

    this.id = doc.shortname;
    this.name = this.id.split('~')[1];
    this.isInterface = 'interface' in doc;
    this.exportType = doc.export || 'default';

    // YUIDoc doesn't support decorators
    this.decorators = [];
    this.fields = [];
    this.methods = [];
    this.accessors = [];

    // Relationships
    this.parentClassId = doc.extends || null;
  }
}

class Component extends Class {
  constructor(doc) {
    super(doc);

    // Attributes
    this.arguments = [];
    this.yields = flattenParams(doc.yields);
  }

  static detect(doc) {
    return doc.file && doc.file.match(/components\//) !== null;
  }
}

module.exports = { Class, Component };
