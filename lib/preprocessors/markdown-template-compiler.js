'use strict';

const stew = require('broccoli-stew');
const compileMarkdown = require('../utils/compile-markdown');

module.exports = class MarkdownTemplateCompiler {
  constructor() {
    this.name = 'markdown-template-compiler';
    this.ext = ['md', 'markdown'];
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.{${this.ext}}`, string => compileMarkdown(string, {
      targetHandlebars: true
    }));

    return stew.rename(compiled, '.md', '.hbs');
  }
};
