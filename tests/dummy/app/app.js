import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

// BEGIN-SNIPPET sample-snippet
App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});
// END-SNIPPET

loadInitializers(App, config.modulePrefix);

export default App;
