import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'dummy/config/environment';
import { registerWarnHandler } from '@ember/debug';

// BEGIN-SNIPPET sample-snippet.js
const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
});
// END-SNIPPET

loadInitializers(App, config.modulePrefix);

registerWarnHandler(function (message, { id }, next) {
  if (id !== 'ember-test-selectors.empty-tag-name') {
    next(...arguments);
  }
});

export default App;
