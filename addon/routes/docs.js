import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class DocsRoute extends Route {
  @service store;

  model() {
    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectName } = config;

    return this.store.findRecord('project', projectName);
  }
}
