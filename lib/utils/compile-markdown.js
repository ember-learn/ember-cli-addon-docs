const marked = require('marked');
const highlightjs = require('highlightjs');

module.exports = function compileMarkdown(string, options = {}) {
  let config = { highlight };

  if (options.targetHandlebars) {
    config.renderer = new HBSRenderer();
  }

  return `<div class="docs-md">${marked(string, config)}</div>`;
};

function highlight(code, lang) {
  return highlightjs.highlight(lang, code).value;
}

class HBSRenderer extends marked.Renderer {
  // Escape curlies in code spans/blocks to avoid treating them as Handlebars
  codespan() {
    return this._escapeCurlies(super.codespan(...arguments));
  }

  code() {
    return this._escapeCurlies(super.code(...arguments));
  }

  // Unescape quotes in text, as they may be part of a Handlebars statement
  text() {
    return super.text(...arguments)
      .replace(/&quot;|&#34;/g, `"`)
      .replace(/&apos;|&#39;/g, `'`);
  }

  _escapeCurlies(string) {
    return string
      .replace(/{{/g, '&#123;&#123;')
      .replace(/}}/g, '&#125;&#125;');
  }
}
