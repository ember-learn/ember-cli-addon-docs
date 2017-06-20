import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  classNames: 'docs-viewer',

  didInsertElement() {
    Ember.$('body').addClass('docs-viewer--showing');
  },

  willDestroyElement() {
    Ember.$('body').removeClass('docs-viewer--showing');
  },

});
