import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { next } from '@ember/runloop';

export default Component.extend({
  tagName: '',

  docsRoutes: service(),

  didInsertElement() {
    this._super(...arguments);
    let model = this.model;

    if (typeof model === 'string' && model.includes('#')) {
      return;
    }

    next(() => {
      this.get('docsRoutes.items').addObject(this);
    });
  },
}).reopenClass({
  positionalParams: ['label', 'route', 'model'],
});
