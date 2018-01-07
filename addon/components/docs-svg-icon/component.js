import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  classNames: 'docs-svg-icon'

}).reopenClass({

  positionalParams: [ 'icon' ]

});
