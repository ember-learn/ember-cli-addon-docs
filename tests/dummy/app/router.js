import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('docs', function() {
    this.route('guides');
    this.route('to-do');
    this.route('api');
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
