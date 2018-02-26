'use strict';

const marked = require('marked');
const highlightjs = require('highlightjs');

module.exports = function compileMarkdown(source, config) {
  let tokens = marked.lexer(source);
  let markedOptions = {
    highlight,
    renderer: new HBSRenderer(config)
  };

  if (config && config.targetHandlebars) {
    tokens = compactParagraphs(tokens);
  }

  return `<div class="docs-md">${marked.parser(tokens, markedOptions).trim()}</div>`;
};

function highlight(code, lang) {
  if (lang) {
    return highlightjs.highlight(lang, code).value;
  } else {
    return highlightjs.highlightAuto(code).value;
  }
}

// Whitespace can imply paragraphs in Markdown, which can result
// in interleaving between <p> tags and block component invocations,
// so this scans the Marked tokens to turn things like this:
//    <p>{{#my-component}}<p>
//    <p>{{/my-component}}</p>
// Into this:
//    <p>{{#my-component}} {{/my-component}}</p>
function compactParagraphs(tokens) {
  let compacted = [];

  compacted.links = tokens.links;

  let balance = 0;
  for (let token of tokens) {
    if (balance === 0) {
      compacted.push(token);
    } else if (token.text) {
      let last = compacted[compacted.length - 1];
      last.text = `${last.text} ${token.text}`;
    }

    balance += count(/\{\{#/g, token.text);
    balance -= count(/\{\{\//g, token.text);
  }

  return compacted;
}

function count(regex, string) {
  let total = 0;
  while (regex.exec(string)) total++;
  return total;
}

class HBSRenderer extends marked.Renderer {
  constructor(config) {
    super();
    this.config = config || {};
  }

  codespan() {
    return this._processCode(super.codespan.apply(this, arguments));
  }

  code() {
    let code = this._processCode(super.code.apply(this, arguments));
    return code.replace(/^<pre>/, '<pre class="docs-md__code">');
  }

  // Unescape quotes in text, as they may be part of a Handlebars statement
  text() {
    let text = super.text.apply(this, arguments);
    if (this.config.targetHandlebars) {
      text = text
        .replace(/&quot;|&#34;/g, `"`)
        .replace(/&apos;|&#39;/g, `'`);
    }
    return text;
  }

  // Escape curlies in code spans/blocks to avoid treating them as Handlebars
  _processCode(string) {
    if (this.config.targetHandlebars) {
      string = this._escapeCurlies(string);
    }

    return string;
  }

  _escapeCurlies(string) {
    return string
      .replace(/{{/g, '&#123;&#123;')
      .replace(/}}/g, '&#125;&#125;');
  }

  heading(text, level) {
    let id = text.toLowerCase().replace(/<\/?.*?>/g, '').replace(/[^\w]+/g, '-');
    return `<h${level} id='${id}' class='docs-md__h${level}'>${text}</h${level}>`;
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
