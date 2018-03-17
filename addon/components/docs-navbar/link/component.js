import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

/**
  Render a link in your DocsHeader header.

  @class DocsNavbar/Link
  @public
*/
export default Component.extend({
  layout,
  router: service(),

  tagName: ''

}).reopenClass({

  positionalParams: [ 'route' ]

});
