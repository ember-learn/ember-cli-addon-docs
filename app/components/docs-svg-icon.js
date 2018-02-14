import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  height: 16,
  width: 16,


}).reopenClass({

  positionalParams: [ 'icon' ]

});
