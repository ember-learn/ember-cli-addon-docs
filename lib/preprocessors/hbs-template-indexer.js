'use strict';

const TemplateTextFilter = require('../broccoli/template-text-filter');
const TextIndexer = require('../broccoli/text-indexer');

module.exports = class HBSTemplateIndexer {
  constructor() {
    this.name = 'hbs-template-indexer';
    this.ext = ['hbs'];
    this._indexTree = null;
  }

  getTemplateIndexTree() {
    if (!this._indexTree) {
      throw new Error(`Templates haven't been indexed yet`);
    }
    return this._indexTree;
  }

  toTree(tree) {
    let templateContentTree = new TemplateTextFilter(tree);
    let searchIndexTree = new TextIndexer(templateContentTree, {
      outputFile: 'ember-cli-addon-docs/template-index.json'
    });

    this._indexTree = searchIndexTree;

    return tree;
  }
};
