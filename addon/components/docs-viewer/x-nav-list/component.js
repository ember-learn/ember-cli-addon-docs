import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  tagName: 'ul',

  classNames: 'docs-viewer__nav-list'

});
