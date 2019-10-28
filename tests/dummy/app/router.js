import AddonDocsRouter, { docsRoute, apiRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {

  docsRoute(this, function() {
    this.route('usage');
    this.route('quickstart');
    this.route('patterns');
    this.route('build-options');
    this.route('deploying');

    this.route('components', function() {
      this.route('docs-hero');
      this.route('docs-logo');
      this.route('docs-header');
      this.route('docs-snippet');
      this.route('docs-viewer');
      this.route('docs-demo');
    });
  });

  this.route('sandbox', function() {
    apiRoute(this);
    docsRoute(this, function() {
      this.route('one', function() {
        this.route('child');
      });
      this.route('two');
    });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
