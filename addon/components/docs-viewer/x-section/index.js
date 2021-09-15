import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  style: 'regular',
}).reopenClass({
  positionalParams: ['label'],
});
