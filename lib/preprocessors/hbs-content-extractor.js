'use strict';

const HBSContentFilter = require('../broccoli/hbs-content-filter');

module.exports = class HBSContentExtractor {
  constructor(bridge) {
    this.name = 'hbs-content-extractor';
    this.ext = ['hbs'];
    this._bridge = bridge;
  }

  toTree(tree) {
    let contentsTree = new HBSContentFilter(tree);
    this._bridge.fulfill('template-contents', contentsTree);
    return tree;
  }
};
