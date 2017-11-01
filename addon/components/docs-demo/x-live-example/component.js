import Component from '@ember/component';
import Ember from 'ember';
import layout from './template';
import snippets from 'dummy/snippets';

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);

    // Set initial template from snippet
    let name = this.get('name');

    // We support either .hbs snippets or .md
    let rawTemplate = snippets[`${name}.hbs`] || snippets[`${name}.md`];

    this.set('rawTemplate', this._unindent(rawTemplate));

    this.compileTemplate();
  },

  compileTemplate() {
    if (this.get('rawTemplate')) {
      let compiledTemplate;
      let error = false;
      try {
        compiledTemplate = Ember.HTMLBars.compile(this.get('rawTemplate'));
      } catch (e) {
        console.error(e);
        error = e;
      }

      // We use two templates to force re-renders of the demo. (Layout cannot
      // be a dynamic property, so it must be torn down and re-rendered.)
      let isUsingA = this.get('compiledTemplateA');
      this.setProperties({
        compiledTemplateA: isUsingA ? null : compiledTemplate,
        compiledTemplateB: isUsingA ? compiledTemplate : null,
        error
      });
    }
  },

  actions: {
    recompile(newValue) {
      this.set('rawTemplate', newValue);
      this.compileTemplate();
    }
  },

  _unindent: function(src) {
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


});
