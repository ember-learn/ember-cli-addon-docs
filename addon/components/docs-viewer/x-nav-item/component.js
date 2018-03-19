import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { next } from '@ember/runloop';

export default Component.extend({
  layout,
  tagName: '',

  docsRoutes: service(),

  didInsertElement() {
    this._super(...arguments);

    next(() => {
      this.get('docsRoutes.items').addObject(this);
    });
  }

}).reopenClass({

  positionalParams: ['label', 'route', 'model']

});
