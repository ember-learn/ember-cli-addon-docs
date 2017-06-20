import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  tagName: 'nav',

  classNames: 'docs-viewer__nav'

});
