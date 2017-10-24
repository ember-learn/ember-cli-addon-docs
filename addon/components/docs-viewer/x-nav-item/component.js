import Ember from 'ember';
import layout from './template';

const Component = Ember.Component.extend({
  layout,

  docsRoutes: Ember.inject.service(),

  tagName: 'li',

  didInsertElement() {
    this._super(...arguments);
    this.get('docsRoutes.items').addObject(this);
  },
});

Component.reopenClass({
  positionalParams: ['label', 'route', 'model']
});

export default Component;
