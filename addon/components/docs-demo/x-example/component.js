import Component from '@ember/component';
import layout from './template';

/**
 * @hideDoc
 */
export default Component.extend({
  layout,

  classNames: 'docs-demo-example',

  init() {
    this._super(...arguments);
    this.set('elementId', 'example-' + this.get('name'));
  }
});
