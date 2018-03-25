import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  
  init() {
    this._super(...arguments);

    scheduleOnce('afterRender', () => {
      this.get('did-init')(this.getProperties('name', 'label', 'language'))
    });
  }

}).reopenClass({

  positionalParams: ['name']

});
