import marked from 'marked';

import hljs from 'highlight.js/lib/highlight';

// Installed languages
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import handlebars from 'highlight.js/lib/languages/handlebars';
import htmlbars from 'highlight.js/lib/languages/htmlbars';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import diff from 'highlight.js/lib/languages/diff';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('htmlbars', htmlbars);
hljs.registerLanguage('hbs', htmlbars);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);

/**
  This function is used when `compileMarkdown` encounters code blocks while
  rendering Markdown source.

  You can use this function on its own if you have code snippets you want
  to highlight at run-time, for example snippets that change based on some
  user interaction.

  ```js
  import Component from '@ember/component';
  import dedent from 'dedent';
  import { highlightCode } from 'ember-cli-addon-docs/utils/compile-markdown';

  export default Component.extend({
    snippet: dedent`
      let { foo } = bar;
    `,

    highlightedSnippet: computed(function() {
      return highlightCode(this.snippet, 'js');
    })
  });
  ```

  ```hbs
  <div class='docs-bg-code-base text-grey overflow-x-scroll'>
    <div class="p-4 w-full">
      <pre>{{{highlightedSnippet}}}</pre>
    </div>
  </div>
  ```

  @function highlightCode
  @param {string} snippet Snippet of code
  @param {string} lang Language to use for syntax highlighting
*/
export function highlightCode(code, lang) {
  return hljs.getLanguage(lang) ? hljs.highlight(lang, code).value : code
}

/**
  This is the function used by AddonDocs to compile Markdown into HTML, for
  example when turning `template.md` files into `template.hbs`. It includes
  some parsing options, as well as syntax highlighting for code blocks.

  You can use it in your own code, so your Markdown-rendered content shares the
  same styling & syntax highlighting as the content AddonDocs already handles.

  For example, you can use it if your Ember App has Markdown data that is
  fetched at runtime from an API:

  ```js
  import Component from '@ember/component';
  import compileMarkdown from 'ember-cli-addon-docs/utils/compile-markdown';
  import { htmlSafe } from '@ember/string';

  export default Component.extend({
    htmlBody: computed('post.body', function() {
      return htmlSafe(compileMarkdown(this.post.body));
    });
  });
  ```

  @function compileMarkdown
  @export default
  @param {string} source Markdown string representing the source content
  @param {object} options? Options. Pass `targetHandlebars: true` if turning MD into HBS
*/
export default function compileMarkdown(source, config) {
  let tokens = marked.lexer(source);
  let markedOptions = {
    highlight: highlightCode,
    renderer: new HBSRenderer(config)
  };

  if (config && config.targetHandlebars) {
    tokens = compactParagraphs(tokens);
  }

  return `<div class="docs-md">${marked.parser(tokens, markedOptions).trim()}</div>`;
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

    let tokenText = token.text || '';
    let textWithoutCode = tokenText.replace(/`[\s\S]*?`/g, '');

    balance += count(/{{#/g, textWithoutCode);
    balance += count(/<[A-Z]/g, textWithoutCode);
    balance -= count(/[A-Z][^<>]+\/>/g, textWithoutCode);
    balance -= count(/{{\//g, textWithoutCode);
    balance -= count(/<\/[A-Z]/g, textWithoutCode);
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

  // Unescape markdown escaping in general, since it can interfere with
  // Handlebars templating
  text() {
    let text = super.text.apply(this, arguments);
    if (this.config.targetHandlebars) {
      text = text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;|&#34;/g, '"')
        .replace(/&apos;|&#39;/g, '\'');
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
    let inner = level === 1 ? text : `<a href="#${id}" class="heading-anchor">${text}</a>`;

    return `
      <h${level} id="${id}" class="docs-md__h${level}">${inner}</h${level}>
    `;
  }

  hr() {
    return `<hr class="docs-md__hr">`;
  }

  blockquote(text) {
    return `<blockquote class="docs-md__blockquote">${text}</blockquote>`;
  }

  link(href, title, text) {
    const titleAttribute = title ? `title="${title}"` : '';
    return `<a href="${href}" ${titleAttribute} class="docs-md__a">${text}</a>`;
  }
}
