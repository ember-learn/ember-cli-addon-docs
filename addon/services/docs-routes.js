import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { cached } from 'tracked-toolbox';

export default class DocsRoutesService extends Service {
  @service('-routing') router;

  @tracked items = A();

  resetState() {
    this.items = A();
  }

  // Each routeParam is [ routeName, model ] where model is optional
  @cached
  get routes() {
    return this.items.map((item) => {
      let routeParams = [item.args.route];
      if (item.args.model) {
        routeParams.push(item.args.model);
      }

      return routeParams;
    });
  }

  @cached
  get routeUrls() {
    return this.routes.map(([routeName, model]) => {
      return this.router.generateURL(routeName, model ? [model] : []);
    });
  }

  @cached
  get currentRouteIndex() {
    if (this.routeUrls.length) {
      let router = this.router.router;
      let currentURL = router.rootURL + router.url;
      currentURL = currentURL.replace('//', '/'); // dedup slashes
      let longestIndex, longestPrefix;
      this.routeUrls.forEach((url, index) => {
        if (
          currentURL.indexOf(url) === 0 &&
          (!longestPrefix || url.length > longestPrefix.length)
        ) {
          longestIndex = index;
          longestPrefix = url;
        }
      });
      assert(
        `DocsRoutes wasn't able to correctly detect the current route. The current url is ${currentURL}`,
        longestIndex != null,
      );
      return longestIndex;
    }

    return null;
  }

  @cached
  get next() {
    let currentIndex = this.currentRouteIndex;

    if (currentIndex < this.routes.length - 1) {
      let nextRouteIndex = currentIndex + 1;
      let route = this.items.objectAt(nextRouteIndex);

      return {
        route: route.args.route,
        models: route.args.model ? [route.args.model] : [],
        label: route.args.label,
      };
    }

    return null;
  }

  @cached
  get previous() {
    let currentIndex = this.currentRouteIndex;

    if (currentIndex > 0) {
      let previousRouteIndex = currentIndex - 1;
      let route = this.items.objectAt(previousRouteIndex);

      return {
        route: route.args.route,
        models: route.args.model ? [route.args.model] : [],
        label: route.args.label,
      };
    }

    return null;
  }
}
