import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from './template';
import Snippets from "dummy/snippets";

export default Component.extend({
  tagName: '',
  layout,

  language: undefined,
  title: undefined,
  showCopy: true,

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

    return this._unindent(
      (Snippets[name] || "")
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
  }),
});
