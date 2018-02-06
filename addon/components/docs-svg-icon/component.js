import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  tagName: '',
  height: 16,
  width: 16,


}).reopenClass({

  positionalParams: [ 'icon' ]

});
