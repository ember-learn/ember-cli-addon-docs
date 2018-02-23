'use strict';

const Document = require('./base-classes/document');

const flattenParams = require('./utils/flatten-params');

class BaseFunction extends Document {
  constructor(doc) {
    super(doc);

    this.returns = doc.return ? {
      type: doc.return.type,
      description: doc.return.description,
      properties: []
    } : null;

    this.params = doc.params ? flattenParams(doc.params) : [];
    this.isAsync = 'async' in doc;
    this.isGenerator = 'generator' in doc;
  }
}

class Function extends BaseFunction {
  constructor(doc) {
    super(doc);

    this.exportType = doc.exportType || 'named';
  }

  static detect(doc) {
    return doc.itemtype === 'function';
  }
}

class Method extends BaseFunction {
  constructor(doc) {
    super(doc);

    this.isStatic = 'static' in doc;
    this.decorators = [];
  }

  static detect(doc) {
    return doc.itemtype === 'method';
  }
}

class Helper extends Function {
  static detect(doc) {
    return super.detect(doc) && doc.file.match(/helpers\//) !== null;
  }
}

module.exports = { Function, Method, Helper };
