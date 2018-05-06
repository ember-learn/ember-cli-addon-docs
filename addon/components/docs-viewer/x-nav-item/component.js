import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { next } from '@ember/runloop';

import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  docsRoutes: service(),

  didInsertElement() {
    this._super(...arguments);
    let model = this.get('model');

    if (typeof model === 'string' && model.includes('#')) {
      return;
    }

    next(() => {
      this.get('docsRoutes.items').addObject(this);
    });
  }
}).reopenClass({

  positionalParams: ['label', 'route', 'model']

});
