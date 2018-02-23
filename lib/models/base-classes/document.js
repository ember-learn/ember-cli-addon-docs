'use strict';

const recognizedAttrs = {
  access: true,
  argument: true,
  classitems: true,
  description: true,
  exportType: true,
  extends: true,
  extension_for: true,
  extensions: true,
  file: true,
  interface: true,
  itemType: true,
  line: true,
  name: true,
  plugin_for: true,
  plugins: true,
  shortname: true,
  tagname: true,
  immutable: true,
  required: true,
  readOnly: true,
  async: true,
  generator: true,
  static: true
}

class Document {
  constructor(doc) {
    this.name = doc.shortname || doc.name;
    this.file = doc.file;
    this.description = doc.description;
    this.lineNumber = doc.line;
    this.access = doc.access;
    this.tags = [];

    for (let key in doc) {
      if (!(key in recognizedAttrs)) {
        this.tags.push({ name: key, value: doc[key] });
      }
    }
  }
}

module.exports = Document;
