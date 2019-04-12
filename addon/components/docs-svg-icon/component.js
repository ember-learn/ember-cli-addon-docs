import Component from '@ember/component';
import layout from './template';

/**
  The standard icon class used in AddonDocs

  @class DocsSvgIcon
  @public
*/
export default Component.extend({
  layout,
  tagName: '',

  /**
    @argument icon
    @type String
    @required
  */
  icon: null,

  /**
    @argument height
    @type Number
  */
  height: 16,

  /**
    @argument width
    @type Number
  */
  width: 16,
}).reopenClass({

  positionalParams: [ 'icon' ]

});
