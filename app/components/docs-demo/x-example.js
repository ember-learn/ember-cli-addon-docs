import Component from '@ember/component';

export default Component.extend({
  classNames: 'docs-demo-example',

  init() {
    this._super(...arguments);
    this.set('elementId', 'example-' + this.get('name'));
  }
});
