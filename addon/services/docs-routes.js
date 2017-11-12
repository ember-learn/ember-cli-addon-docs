import { computed } from '@ember/object';
import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { assert } from '@ember/debug';

export default Service.extend({

  router: service('-routing'),

  init() {
    this._super(...arguments);
    this.resetState();
  },

  resetState() {
    this.set('items', A());
  },

  // Each routeParam is [ routeName, model ] where model is optional
  routes: computed('items.[]', function() {
    return this.get('items').map(item => {
      let routeParams = [ item.route ];
      if (item.model) {
        routeParams.push(item.model);
      }

      return routeParams;
    });
  }),

  routeUrls: computed('routes.[]', function() {
    return this.get('routes').map(route => {
      return hrefTo.apply(null, [this, ...route]);
    });
  }),

  currentRouteIndex: computed('router.router.currentURL', 'routeUrls.[]', function() {
    if (this.get('routeUrls.length')) {
      let currentURL = this.get('router.router.currentURL').replace(/\/$/, "");
      let index = this.get('routeUrls').indexOf(currentURL);
      assert(`DocsRoutes wasn't able to correctly detect the current route.`, index > -1);
      return index;
    }
  }),

  nextRoute: computed('currentRouteIndex', 'routes.[]', function() {
    let currentIndex = this.get('currentRouteIndex');

    if (currentIndex < this.get('routes.length')) {
      return this.get('routes')[(currentIndex + 1)];
    }
  }),

  previousRoute: computed('currentRouteIndex', 'routes.[]', function() {
    let currentIndex = this.get('currentRouteIndex');

    if (currentIndex > 0) {
      return this.get('routes')[(currentIndex - 1)];
    }
  })
  
});
