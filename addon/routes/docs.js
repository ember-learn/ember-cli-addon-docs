import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getAddonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class DocsRoute extends Route {
  @service store;

  model() {
    return this.store.findRecord(
      'project',
      getAddonDocsConfig(this).projectName,
    );
  }
}
