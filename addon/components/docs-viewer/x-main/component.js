import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  docsRoutes: Ember.inject.service(),

  tagName: 'main',

  elementId: 'docs-viewer__scroll-body',
  classNames: 'docs-viewer__main'

});
