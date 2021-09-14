import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  router: service(),

  isActive: computed('router.currentRouteName', 'route', function () {
    // Naive isActive check. Replace with router service when updated.
    return this.get('router.currentRouteName').indexOf(this.route) === 0;
  }),
}).reopenClass({
  positionalParams: ['route'],
});
