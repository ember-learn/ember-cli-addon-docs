/** @documenter yuidoc */

import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';

/**
  The AddonDocsRouter, which adds some extra functionality. This should be used
  instead of the standard EmberRouter class in your docs app.

  ```js
  import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
  import config from './config/environment';

  const Router = AddonDocsRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
  });
  ```

  @class AddonDocsRouter
  @extends EmberRouter
*/
export default EmberRouter.extend(RouterScroll);

/**
  Creates the docs route and api docs routes. Can receive a callback with the
  routes you want to add to your docs.

  ```js
  import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';

  Router.map(function() {
    docsRoute(this, function() {
      this.route('usage');
    });
  });
  ```

  @function docsRoute
*/
export function docsRoute(router, callback) {
  router.route('docs', function() {
    callback.apply(this);

    apiRoute(this);
  });
}

export function apiRoute(router) {
  router.route('api', function() {
    this.route('item', { path: '/*path' });
  });
}
