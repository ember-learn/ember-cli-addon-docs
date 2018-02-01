'use strict';

const marked = require('marked');
const highlightjs = require('highlightjs');

module.exports = function compileMarkdown(source, options) {
  let tokens;
  let config = { highlight };

  if (options && options.targetHandlebars) {
    config.renderer = new HBSRenderer();
    tokens = compactParagraphs(source);
  } else {
    tokens = marked.lexer(source);
  }

  return `<div class="docs-md">${marked.parser(tokens, config).trim()}</div>`;
};

function highlight(code, lang) {
  if (lang) {
    return highlightjs.highlight(lang, code).value;
  } else {
    return highlightjs.highlightAuto(code).value;
  }
}

function compactParagraphs(source) {
  let tokens = marked.lexer(source);
  let compacted = [];

  compacted.links = tokens.links;

  let diff = 0;
  for (let token of tokens) {
    let wasBalanced = diff === 0;

    diff += count(/\{\{#/g, token.text);
    diff -= count(/\{\{\//g, token.text);

    if (wasBalanced) {
      compacted.push(token);
    } else {
      let last = compacted[compacted.length - 1];
      last.text = `${last.text} ${token.text}`;
    }
  }

  return compacted;
}

function count(regex, string) {
  let total = 0;
  while (regex.exec(string)) total++;
  return total;
}

class HBSRenderer extends marked.Renderer {
  // Escape curlies in code spans/blocks to avoid treating them as Handlebars
  codespan() {
    return this._escapeCurlies(super.codespan.apply(this, arguments));
  }

  code() {
    let code = this._escapeCurlies(super.code.apply(this, arguments));
    return code.replace(/^<pre>/, '<pre class="docs-md__code">');
  }

  // Unescape quotes in text, as they may be part of a Handlebars statement
  text() {
    return super.text.apply(this, arguments)
      .replace(/&quot;|&#34;/g, `"`)
      .replace(/&apos;|&#39;/g, `'`);
  }

  _escapeCurlies(string) {
    return string
      .replace(/{{/g, '&#123;&#123;')
      .replace(/}}/g, '&#125;&#125;');
  }

  heading(text, level) {
    return `<h${level} class='docs-md__h${level}'>${text}</h${level}>`;
  }

  hr() {
    return `<hr class='docs-md__hr'>`;
  }

  blockquote(text) {
    return `<blockquote class='docs-md__blockquote'>${text}</blockquote>`;
  }

  link(href, title, text) {
    return `<a href="${href}" title="${title}" class="docs-md__a">${text}</a>`;
  }
}
