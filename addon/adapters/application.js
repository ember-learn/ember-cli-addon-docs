import { inject as service } from '@ember/service';
import DS from 'ember-data';
import config from 'dummy/config/environment';

export default DS.Adapter.extend({

  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,

  ajax: service(),

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return this.get('ajax').request(`${this.namespace}/index.json`);
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
});
