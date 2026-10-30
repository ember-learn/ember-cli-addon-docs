'use strict';

const Filter = require('broccoli-filter');
const syntax = require('@glimmer/syntax');
const { Preprocessor } = require('content-tag');

const TEMPLATE_TAG_EXTENSIONS = ['gjs', 'gts'];

module.exports = class HBSContentFilter extends Filter {
  constructor(input) {
    super(input);
    this.extensions = ['hbs', ...TEMPLATE_TAG_EXTENSIONS];
    this.targetExtension = 'template-contents';
  }

  processString(content, relativePath) {
    let templates = extractTemplates(content, relativePath);
    let parents = new Map();
    let title = { level: Infinity, node: null, contents: null };
    let body = [];

    for (let template of templates) {
      syntax.traverse(syntax.preprocess(template), {
        Program(node) {
          addContentNodes(parents, node, node.body);
        },

        ElementNode(node) {
          addContentNodes(parents, node, node.children);
        },

        TextNode(node) {
          let parent = parents.get(node);
          if (!parent) {
            return;
          }

          body.push(node.chars);

          if (title.node === parent) {
            title.contents.push(node.chars);
          } else if (isHeading(parent) && headingLevel(parent) < title.level) {
            title = {
              level: headingLevel(parent),
              node: parent,
              contents: [node.chars],
            };
          }
        },
      });
    }

    let output = {
      title: title.contents ? title.contents.join('') : null,
      body: body.join(''),
    };

    return JSON.stringify(output);
  }
};

// A gjs/gts file can hold several `<template>` tags, while an hbs file is a
// single template.
function extractTemplates(content, relativePath) {
  if (
    !TEMPLATE_TAG_EXTENSIONS.some((ext) => relativePath.endsWith(`.${ext}`))
  ) {
    return [content];
  }

  return new Preprocessor()
    .parse(content, { filename: relativePath })
    .map((template) => template.contents);
}

function isHeading(node) {
  return node.type === 'ElementNode' && /^h\d$/.test(node.tag);
}

function headingLevel(node) {
  return Number(node.tag[1]);
}

function addContentNodes(parents, parent, candidates) {
  for (let candidate of candidates) {
    if (candidate.type === 'TextNode') {
      parents.set(candidate, parent);
    }
  }
}
