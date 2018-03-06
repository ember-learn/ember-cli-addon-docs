import Route from '@ember/routing/route';
import config from 'dummy/config/environment';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Route.extend({

  model() {
    return this.store.findRecord('project', packageJson.name);
  }

});
