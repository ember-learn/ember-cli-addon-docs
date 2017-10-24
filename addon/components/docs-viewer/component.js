import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  docsRoutes: Ember.inject.service(),

  classNames: 'docs-viewer',

  didInsertElement() {
    Ember.$('body').addClass('docs-viewer--showing');
  },

  willDestroyElement() {
    Ember.$('body').removeClass('docs-viewer--showing');
    this.get('docsRoutes').resetState();
  },

});
