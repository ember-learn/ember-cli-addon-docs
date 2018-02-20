import { inject as service } from '@ember/service';
import DS from 'ember-data';
import config from 'dummy/config/environment';

export default DS.Adapter.extend({

  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,

  projectVersion: service(),

  project: null,

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return fetch(`${this.namespace}/index.json`).then(r => r.json());
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
});
