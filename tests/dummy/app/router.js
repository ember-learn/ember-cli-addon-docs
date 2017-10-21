import Ember from 'ember';
import config from './config/environment';
import RouterScroll from 'ember-router-scroll';

const Router = Ember.Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('docs', function() {
    this.route('quickstart');

    this.route('patterns');

    this.route('components', function() {
      this.route('docs-hero');
      this.route('docs-logo');
      this.route('docs-navbar');
      this.route('docs-snippet');
      this.route('docs-viewer');
      this.route('docs-demo');
    });

    this.route('api', function() {
      this.route('class', { path: '/:class_id' });
    });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
