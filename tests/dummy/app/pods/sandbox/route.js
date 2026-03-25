import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SandboxRoute extends Route {
  @service docsStore;

  model() {
    return this.docsStore.findRecord('project', 'sandbox');
  }
}
