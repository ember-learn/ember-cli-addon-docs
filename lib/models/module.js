'use strict';

class Module {
  constructor(doc) {
    this.id = doc.name;

    // Attributes
    this.file = doc.name;
    this.functions = [];
    this.helpers = [];
    this.variables = [];

    // Relationships
    this.classes = [];
    this.components = [];
  }
}

module.exports = Module;
