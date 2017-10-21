import Ember from 'ember';
import layout from './template';

const Component = Ember.Component.extend({
  layout,

  tagName: 'li'
});

Component.reopenClass({
  positionalParams: ['label', 'route', 'model']
});

export default Component;
