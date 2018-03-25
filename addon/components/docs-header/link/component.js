import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',

  router: service(),

  isActive: computed('router.currentRouteName', 'route', function() {
    // Naive isActive check. Replace with router service when updated.
    return this.get('router.currentRouteName').indexOf(this.get('route')) === 0;
  })

}).reopenClass({

  positionalParams: [ 'route' ]

});
