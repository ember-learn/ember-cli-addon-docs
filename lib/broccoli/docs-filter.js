'use strict';

const Filter = require('broccoli-persistent-filter');

const documenterRegex = /\/\*+\s*@documenter ([a-zA-Z]+)\s*\*+\//;

module.exports = class DocsFilter extends Filter {
  constructor(inputNode, documenter) {
    super(inputNode);

    this.documenter = documenter;
  }

  processString(content) {
    let match = content.match(documenterRegex);

    if (match) {
      if (match[1] === this.documenter) {
        return content.replace(documenterRegex, '');
      }

      return '';
    }

    return content;
  }
}
