import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('docs', function() {
    this.route('usage');
    this.route('quickstart');
    this.route('patterns');
    this.route('deploying');

    this.route('components', function() {
      this.route('docs-hero');
      this.route('docs-logo');
      this.route('docs-navbar');
      this.route('docs-snippet');
      this.route('docs-viewer');
      this.route('docs-demo');
    });

    this.route('api', function() {
      this.route('item', { path: '/*path' });
    });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
