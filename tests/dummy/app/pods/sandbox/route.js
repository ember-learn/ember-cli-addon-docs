import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SandboxRoute extends Route {
  @service store;

  model() {
    return this.store.findRecord('project', 'sandbox');
  }
}
