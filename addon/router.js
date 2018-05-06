import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';

export default EmberRouter.extend(RouterScroll);

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
