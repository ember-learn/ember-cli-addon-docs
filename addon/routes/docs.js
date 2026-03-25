import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getAddonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class DocsRoute extends Route {
  @service docsStore;

  model() {
    return this.docsStore.findRecord(
      'project',
      getAddonDocsConfig(this).projectName,
    );
  }
}
