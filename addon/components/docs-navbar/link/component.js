import Component from '@ember/component';
import layout from './template';

/**
  Render a link in your DocsHeader header.

  @class DocsNavbar/Link
  @public
*/
export default Component.extend({
  layout,

  tagName: ''

}).reopenClass({

  positionalParams: [ 'route' ]

});
