import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({

  projectVersion: service(),

  model() {
    return this.store.findRecord('project', 'ember-cli-addon-docs')
      .then(project => {
        let projectVersion = project.get('projectVersions.firstObject.id');
        let version = projectVersion.split('ember-cli-addon-docs-')[1];

        this.set('projectVersion.version', version);

        return this.store.findRecord('project-version', projectVersion);
      });
  }


});
