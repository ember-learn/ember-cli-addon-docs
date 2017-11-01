import { equal, match } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  router: service('-routing'),

  isHome: equal('router.currentPath', 'index'),
  isViewingDocs: match('router.currentPath', /docs/),

  tagName: 'nav',
  classNames: 'docs-navbar'

});
