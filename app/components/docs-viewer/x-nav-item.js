import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { next } from '@ember/runloop';

export default Component.extend({
  docsRoutes: service(),

  tagName: 'li',

  didInsertElement() {
    this._super(...arguments);

    next(() => {
      this.get('docsRoutes.items').addObject(this);
    });
  }

}).reopenClass({

  positionalParams: ['label', 'route', 'model']

});
