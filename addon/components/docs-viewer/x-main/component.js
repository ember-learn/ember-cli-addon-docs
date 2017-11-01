import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  docsRoutes: service(),

  tagName: 'main',

  elementId: 'docs-viewer__scroll-body',
  classNames: 'docs-viewer__main'

});
