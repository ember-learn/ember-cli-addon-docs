import Ember from 'ember';
import layout from './template';
import snippets from 'dummy/snippets';

export default Ember.Component.extend({
  layout,

  init() {
    this._super(...arguments);

    // Set initial template from snippet
    let name = this.get('name');
    this.set('rawTemplate', snippets[name]);

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
    recompile() {
      this.compileTemplate();
    }
  }


});
