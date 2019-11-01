import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from './template';
import config from 'ember-get-config';
import require from 'require';

/**
  A snippet component for demonstrating some code

  ```hbs
  {{docs-snippet name=snippet.name unindent=true language=snippet.language}}
  ```

  @class DocsSnippet
  @public
*/
export default Component.extend({
  tagName: '',
  layout,

  /**
    The name of the snippet

    @argument name
    @type String?
  */
  name: null,

  /**
    The language of the snippet

    @argument language
    @type String?
  */
  language: null,

  /**
    The title of the snippet

    @argument title
    @type String?
  */
  title: null,

  /**
    Whether or not to show the copy button for this snippet

    @argument showCopy
    @type Boolean
  */
  showCopy: true,

  /**
    Whether or not the snippet should be unindented

    @argument unindent
    @type Boolean
  */
  unindent: false,

  _unindent: function(src) {
    if (!this.get('unindent')) {
      return src;
    }
    var match, min, lines = src.split("\n").filter(l => l !== '');
    for (var i = 0; i < lines.length; i++) {
      match = /^[ \t]*/.exec(lines[i]);
      if (match && (typeof min === 'undefined' || min > match[0].length)) {
        min = match[0].length;
      }
    }
    if (typeof min !== 'undefined' && min > 0) {
      src = src.replace(new RegExp("^[ \t]{" + min + "}", 'gm'), "");
    }
    return src;
  },

  snippetText: computed('name', function(){
    let name = this.get('name');
    if (!/\..+/.test(name)) {
      name += '.hbs';
    }

    let snippet = require(config.modulePrefix + "/snippets")[name] || "";

    return this._unindent(
      snippet
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
  }),
});
