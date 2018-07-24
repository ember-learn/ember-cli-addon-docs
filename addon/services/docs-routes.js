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

  currentRouteIndex: computed('router.router.url', 'routeUrls.[]', function() {
    if (this.get('routeUrls.length')) {
      let router = this.get('router.router');
      let currentURL = router.get('rootURL') + router.get('url');
      currentURL = currentURL.replace('//', '/')   // dedup slashes
      let longestIndex, longestPrefix;
      this.get('routeUrls').forEach((url, index) => {
        if (currentURL.indexOf(url) === 0 && (!longestPrefix || url.length > longestPrefix.length)) {
          longestIndex = index;
          longestPrefix = url;
        }
      });
      assert(`DocsRoutes wasn't able to correctly detect the current route. The current url is ${currentURL}`, longestIndex != null);
      return longestIndex;
    }
  }),

  next: computed('currentRouteIndex', 'routes.[]', function() {
    let currentIndex = this.get('currentRouteIndex');

    if (currentIndex < (this.get('routes.length') - 1)) {
      let nextRouteIndex = currentIndex + 1;
      let route = this.get('routes')[(nextRouteIndex)];

      return {
        route,
        label: this.get('items').objectAt(nextRouteIndex).get('label')
      };
    }
  }),

  previous: computed('currentRouteIndex', 'routes.[]', function() {
    let currentIndex = this.get('currentRouteIndex');

    if (currentIndex > 0) {
      let previousRouteIndex = currentIndex - 1;
      let route = this.get('routes')[(previousRouteIndex)];

      return {
        route,
        label: this.get('items').objectAt(previousRouteIndex).get('label')
      };
    }
  })

});
