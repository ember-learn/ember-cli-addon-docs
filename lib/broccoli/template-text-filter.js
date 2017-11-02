'use strict';

const Filter = require('broccoli-filter');
const syntax = require('@glimmer/syntax');

module.exports = class TemplateIndexer extends Filter {
  constructor(input) {
    super(input);
    this.extensions = ['hbs'];
    this.targetExtension = 'text-index';
  }

  processString(content) {
    let contentNodes = new Set();
    let output = [];

    syntax.traverse(syntax.preprocess(content), {
      Program(node) {
        addContentNodes(contentNodes, node.body);
      },

      ElementNode(node) {
        addContentNodes(contentNodes, node.children);
      },

      TextNode(node) {
        if (contentNodes.has(node)) {
          if (node.chars.length) {
            output.push(node.chars);
          }
        }
      }
    });

    return JSON.stringify(output);
  }
}

function addContentNodes(contentNodes, candidates) {
  for (let candidate of candidates) {
    if (candidate.type === 'TextNode') {
      contentNodes.add(candidate);
    }
  }
}
