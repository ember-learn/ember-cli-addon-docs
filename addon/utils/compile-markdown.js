import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { parse as htmlParse } from 'node-html-parser';
import { parse as hbsParse } from '@handlebars/parser';
import lineColumn from 'line-column';

import hljs from 'highlight.js/lib/core';

// Installed languages
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import handlebars from 'highlight.js/lib/languages/handlebars';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import diff from 'highlight.js/lib/languages/diff';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('hbs', handlebars);
hljs.registerLanguage('htmlbars', handlebars);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);

const htmlComponent = {
  name: 'htmlComponent',
  level: 'block',
  start(src) {
    // stop text tokenizer at the next potential match.
    // we're only interested in html blocks that begin in a new line
    let match = src.match(/\n<[^/^\s>]/);
    return match && match.index;
  },
  tokenizer(src) {
    let openingRule = /^<([^/^\s>]+)\s?[\s\S]*?>/;
    let openingMatch = openingRule.exec(src);

    if (openingMatch) {
      let openingTag = openingMatch[1];

      let root = htmlParse(src);

      for (let el of root.childNodes) {
        if (el.rawTagName === openingTag) {
          let finalMatch = src.substring(el.range[0], el.range[1]);

          return {
            type: 'htmlComponent',
            raw: finalMatch,
            text: finalMatch,
            tokens: [],
          };
        }
      }
    }
  },
  renderer(token) {
    return `\n<p>${token.text}</p>\n`;
  },
};

const hbsComponent = {
  name: 'hbsComponent',
  level: 'block',
  start(src) {
    // stop text tokenizer at the next potential match.
    // we're only interested in hbs blocks that begin in a new line
    let match = src.match(/\n{{#\S/);
    return match && match.index;
  },
  tokenizer(src) {
    let openingRule = /^{{#([A-Za-z-]+)[\S\s]+?}}/;
    let openingMatch = openingRule.exec(src);

    if (openingMatch) {
      let openingTag = openingMatch[1];

      let root = hbsParse(src);

      for (let el of root.body) {
        if (el.path && el.path.original === openingTag) {
          let start = lineColumn(src).toIndex([
            el.loc.start.line,
            el.loc.start.column,
          ]);
          let end = lineColumn(src).toIndex([
            el.loc.end.line,
            el.loc.end.column,
          ]);
          let finalMatch = src.substring(start, end + 1);

          return {
            type: 'hbsComponent',
            raw: finalMatch,
            text: finalMatch,
            tokens: [],
          };
        }
      }
    }
  },
  renderer(token) {
    return `\n<p>${token.text}</p>\n`;
  },
};

marked.use({ extensions: [htmlComponent, hbsComponent] });

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight: highlightCode,
  }),
);

/**
  This function is used when `compileMarkdown` encounters code blocks while
  rendering Markdown source.

  You can use this function on its own if you have code snippets you want
  to highlight at run-time, for example snippets that change based on some
  user interaction.

  ```js
  import Component from '@glimmer/component';
  import dedent from 'dedent';
  import { highlightCode } from 'ember-cli-addon-docs/utils/compile-markdown';

  export default class MyComponent extends Component {
    snippet = dedent`
      let { foo } = bar;
    `;

    get highlightedSnippet() {
      return highlightCode(this.snippet, 'js');
    }
  }
  ```

  ```hbs
  <div class="docs-bg-code-base text-grey overflow-x-scroll">
    <div class="p-4 w-full">
      <pre>{{{highlightedSnippet}}}</pre>
    </div>
  </div>
  ```

  @function highlightCode
  @param {string} snippet Snippet of code
  @param {string} lang Language to use for syntax highlighting
*/
export function highlightCode(code, language) {
  return hljs.getLanguage(language)
    ? hljs.highlight(code, { language }).value
    : code;
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
  import Component from '@glimmer/component';
  import compileMarkdown from 'ember-cli-addon-docs/utils/compile-markdown';
  import { htmlSafe } from '@ember/template';

  export default class MyComponent extends Component {
    get htmlBody() {
      return htmlSafe(compileMarkdown(this.post.body));
    }
  }
  ```

  @function compileMarkdown
  @export default
  @param {string} source Markdown string representing the source content
  @param {object} options? Options. Pass `targetHandlebars: true` if turning MD into HBS
*/
export default function compileMarkdown(source, config) {
  let markedOptions = {
    renderer: new HBSRenderer(config),
  };

  return `<div class="docs-md">${marked.parse(source, markedOptions)}</div>`;
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
        .replace(/&apos;|&#39;/g, "'");
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
    return string.replace(/{{/g, '&#123;&#123;').replace(/}}/g, '&#125;&#125;');
  }

  heading(text, level) {
    let id = text
      .toLowerCase()
      .replace(/<\/?.*?>/g, '')
      .replace(/[^\w]+/g, '-');
    let inner =
      level === 1
        ? text
        : `<a href="#${id}" class="heading-anchor">${text}</a>`;

    return `
      <h${level} id="${id}" class="docs-md__h${level}">${inner}</h${level}>
    `;
  }

  list(text, ordered) {
    if (ordered) {
      return `
        <ol class="docs-list-decimal">${text}</ol>
      `;
    } else {
      return `
        <ul class="docs-list-disc">${text}</ul>
      `;
    }
  }

  table(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';

    return (
      '<table class="docs-table-auto">\n' +
      '<thead>\n' +
      header +
      '</thead>\n' +
      body +
      '</table>\n'
    );
  }

  tablerow(content) {
    return '<tr class="docs-table-row">\n' + content + '</tr>\n';
  }

  tablecell(content, flags) {
    let type = flags.header ? 'th' : 'td';
    let tag = flags.align
      ? '<' +
        type +
        ' align="' +
        flags.align +
        '" class="docs-border docs-px-4 docs-py-2">'
      : '<' + type + ' class="docs-border docs-px-4 docs-py-2">';
    return tag + content + '</' + type + '>\n';
  }

  hr() {
    return `<hr class="docs-md__hr">`;
  }

  blockquote(text) {
    return `<blockquote class="docs-md__blockquote">${text}</blockquote>`;
  }

  link(href, title, text) {
    let titleAttribute = title ? `title="${title}"` : '';
    return `<a href="${href}" ${titleAttribute} class="docs-md__a">${text}</a>`;
  }
}
