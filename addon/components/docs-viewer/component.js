import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  docsRoutes: service(),

  classNames: 'docs-viewer',

  didInsertElement() {
    $('body').addClass('docs-viewer--showing');
  },

  willDestroyElement() {
    $('body').removeClass('docs-viewer--showing');
    this.get('docsRoutes').resetState();
  },

});
