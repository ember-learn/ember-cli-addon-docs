import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  router: Ember.inject.service('-routing'),

  isHome: Ember.computed.equal('router.currentPath', 'index'),

  tagName: 'nav',
  classNames: 'docs-navbar'

});
