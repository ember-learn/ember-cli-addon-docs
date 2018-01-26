'use strict';

const marked = require('marked');
const highlightjs = require('highlightjs');

module.exports = function compileMarkdown(string, options) {
  let config = {
    highlight,
    renderer: new HBSRenderer(options),
  };

  return `<div class="docs-md">${marked(string, config)}</div>`;
};

function highlight(code, lang) {
  if (lang) {
    return highlightjs.highlight(lang, code).value;
  } else {
    return highlightjs.highlightAuto(code).value;
  }
}

class HBSRenderer extends marked.Renderer {
  constructor(config) {
    super();
    this.config = config;
  }

  // Escape curlies in code spans/blocks to avoid treating them as Handlebars
  codespan() {
    return this._escapeCurlies(super.codespan.apply(this, arguments));
  }

  code(text, lang) {
    if (lang && lang.indexOf('|') > -1) {
      return this._buildDocsSnippetInvocation(text, lang);
    } else {
      let code = super.code.apply(this, arguments);
      if (this.config.targetHandlebars) {
        code = this._escapeCurlies(code);
      }
      return code.replace(/^<pre>/, '<pre class="docs-md__code">');
    }
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

  // Convert code blocks like ```js|name='foo'|attr='bar'
  // into {{docs-snippet language='js' name='foo' attr='bar'}}
  _buildDocsSnippetInvocation(text, lang) {
    if (!this.config.targetHandlebars) {
      throw new Error(`${this.config.file}: Custom code snippet attributes aren't supported in doc comments.`);
    }

    let pipeIndex = lang.indexOf('|');
    let componentProps = this._parseAttrs(lang.slice(pipeIndex + 1));
    return `{{docs-snippet language='${lang.slice(0, pipeIndex)}' ${componentProps}}}`;
  }

  _parseAttrs(string) {
    let regex = /(.+?)=('|")?(.*?)(?:\2)(?:\||$)/g;
    let attrs = [];

    let match;
    while ((match = regex.exec(string))) {
      let key = match[1];
      let quote = match[2];
      let value = match[3];
      if (key === 'name') {
        value += '.md';
      }

      attrs.push(`${key}=${quote}${value}${quote}`);
    }
    return attrs.join(' ');
  }
}
