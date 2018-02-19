import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'dummy/config/environment';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Route.extend({

  projectVersion: service(),

  model() {
    return this.store.findRecord('project', packageJson.name);
  }

});
