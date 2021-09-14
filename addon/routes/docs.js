import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

const projectName = config['ember-cli-addon-docs'].projectName;

export default class DocsRoute extends Route {
  @service store;

  model() {
    return this.store.findRecord('project', projectName);
  }
}