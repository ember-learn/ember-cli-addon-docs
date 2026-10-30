import Component from '@glimmer/component';
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

// highlight.js has no grammar for gjs/gts, so we extend the JS/TS grammars to
// highlight `<template>` blocks as Handlebars. `<template>` can directly follow
// modes that swallow whitespace and enable JSX, so it is added to those as well.
function glimmerTemplateTag(baseLanguage) {
  return (hljs) => {
    const language = baseLanguage(hljs);
    const templateTag = () => ({
      begin: /<template>/,
      end: /<\/template>/,
      beginScope: 'tag',
      endScope: 'tag',
      subLanguage: 'handlebars',
    });

    language.contains.unshift(templateTag());
    for (let mode of language.contains) {
      if (mode.contains?.some((child) => child.subLanguage === 'xml')) {
        mode.contains.unshift(templateTag());
      }
    }

    return language;
  };
}

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('htmlbars', handlebars);
hljs.registerLanguage('hbs', handlebars);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('gjs', glimmerTemplateTag(javascript));
hljs.registerLanguage('gts', glimmerTemplateTag(typescript));

export default class DocsCodeHighlight extends Component {
  setupElement(element) {
    hljs.highlightElement(element);
  }
}
