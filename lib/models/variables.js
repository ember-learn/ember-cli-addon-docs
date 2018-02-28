'use strict';

const Document = require('./base-classes/document');

class BaseVariable extends Document {
  constructor(doc) {
    super(doc);

    this.type = doc.type || 'any';
  }
}

class Variable extends BaseVariable {
  constructor(doc) {
    super(doc);

    this.exportType = doc.export || 'named';
  }

  static detect(doc) {
    return doc.itemtype === 'variable' || doc.itemtype === 'constant' || doc.itemtype === 'const';
  }
}

class Field extends BaseVariable {
  constructor(doc) {
    super(doc);

    this.isStatic = 'static' in doc;
    this.decorators = [];

    this.isRequired = 'required' in doc;
    this.isImmutable = 'immutable' in doc;
    this.isReadOnly = 'readonly' in doc;
  }

  static detect(doc) {
    return doc.itemtype === 'property' || doc.itemtype === 'field';
  }
}

class Accessor extends Field {
  constructor(doc) {
    super(doc);

    this.hasGetter = 'get' in doc ? doc.get !== 'false' : true;

    if ('set' in doc) {
      this.hasSetter = doc.set !== 'false';
    } else if ('readonly' in doc) {
      this.hasSetter = false;
    } else {
      this.hasSetter = doc.itemtype === 'computed';
    }
  }

  static detect(doc) {
    return doc.itemtype === 'accessor' || doc.itemtype === 'computed';
  }
}

class Argument extends Field {
  static detect(doc) {
    return doc.itemtype === 'argument';
  }
}

module.exports = { Variable, Field, Accessor, Argument };
