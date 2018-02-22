'use strict';

const Document = require('./base-classes/document');

class BaseVariable extends Document {
  constructor(doc) {
    super(doc);

    this.type = doc.type;
  }
}

class Variable extends BaseVariable {
  constructor(doc) {
    super(doc);

    this.exportType = doc.exportType || 'named';
  }

  static detect(doc) {
    return doc.itemtype === 'variable' || doc.itemtype === 'constant' || doc.itemtype === 'const';
  }
}

class Field extends Variable {
  constructor(doc) {
    super(doc);

    this.isStatic = 'static' in doc;
    this.decorators = [];

    this.isRequired = 'required' in doc;
    this.isImmutable = 'immutable' in doc;
    this.isReadOnly = 'readOnly' in doc;
  }

  static detect(doc) {
    return doc.itemtype === 'property' || doc.itemtype === 'field';
  }
}

class Argument extends Field {
  static detect(doc) {
    return super.detect(doc) && 'argument' in doc;
  }
}

module.exports = { Variable, Field, Argument };
