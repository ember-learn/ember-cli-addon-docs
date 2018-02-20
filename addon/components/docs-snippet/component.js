import Component from '@ember/component';
import Snippets from "dummy/snippets";

import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';

import layout from './template';

@tagName('')
export default class DocsSnippetComponent extends Component {
  layout = layout;

  @argument
  @type(optional('string'))
  language;

  @argument
  @type(optional('string'))
  title;

  @argument
  @type(optional('string'))
  name;

  @argument({ defaultIfUndefined: true })
  @type('boolean')
  showCopy = true;

  @argument({defaultIfUndefined: true })
  @type('boolean')
  unindent = false;

  _unindent(src) {
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
  }

  @computed('name')
  get snippetText() {
    let name = this.get('name');
    if (!/\..+/.test(name)) {
      name += '.hbs';
    }

    return this._unindent(
      (Snippets[name] || "")
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
  }
}
