import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  docsRoutes: service(),

  tagName: 'li',

  didInsertElement() {
    this._super(...arguments);
    this.get('docsRoutes.items').addObject(this);
  },
}).reopenClass({
  positionalParams: ['label', 'route', 'model']
});
