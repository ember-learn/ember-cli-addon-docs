import Route from '@ember/routing/route';
import config from 'ember-get-config';

const projectName = config['ember-cli-addon-docs'].projectName;

export default Route.extend({

  model() {
    return this.store.findRecord('project', projectName);
  }

});
