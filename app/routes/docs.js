import Ember from 'ember';
import config from '../config/environment';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Ember.Route.extend({

  projectVersion: Ember.inject.service(),

  model() {
    return this.store.findRecord('project', packageJson.name)
      .then(project => {
        let projectVersion = project.get('projectVersions.firstObject.id');
        let version = projectVersion.split(`${packageJson.name}-`)[1];

        this.set('projectVersion.version', version);

        return this.store.findRecord('project-version', projectVersion);
      });
  }

});
