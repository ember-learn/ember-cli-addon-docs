import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  classNames: 'docs-demo-example',

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('elementId', 'example-' + this.get('name'));
  }
});
