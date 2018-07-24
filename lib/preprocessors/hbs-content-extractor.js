'use strict';

const HBSContentFilter = require('../broccoli/hbs-content-filter');

module.exports = class HBSContentExtractor {
  constructor(bridge) {
    this.name = 'hbs-content-extractor';
    this.ext = ['hbs'];
    this._bridge = bridge;
  }

  toTree(tree) {
    this._bridge.register({
      name: 'template-contents',
      tree: new HBSContentFilter(tree),
    });

    return tree;
  }
};
