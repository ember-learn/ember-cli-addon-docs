'use strict';

const HBSContentFilter = require('../broccoli/hbs-content-filter');

module.exports = class HBSContentExtractor {
  constructor() {
    this.name = 'hbs-content-extractor';
    this.ext = ['hbs'];
    this._contentsTree = null;
  }

  getTemplateContentsTree() {
    if (!this._contentsTree) {
      throw new Error(`Templates contents haven't been extracted yet`);
    }
    return this._contentsTree;
  }

  toTree(tree) {
    this._contentsTree = new HBSContentFilter(tree);
    return tree;
  }
};
