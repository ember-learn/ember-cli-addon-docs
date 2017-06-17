import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  router: Ember.inject.service('-routing'),

  isHome: Ember.computed.equal('router.currentPath', 'index'),
  isViewingDocs: Ember.computed.match('router.currentPath', /docs/),

  tagName: 'nav',
  classNames: 'docs-navbar'

});
