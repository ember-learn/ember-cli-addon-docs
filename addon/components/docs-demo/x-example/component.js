import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  classNames: 'p-4',

  init() {
    this._super(...arguments);
    this.set('elementId', 'example-' + this.get('name'));
  }
});
