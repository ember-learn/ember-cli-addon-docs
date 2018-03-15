import DS from 'ember-data';
import config from 'dummy/config/environment';
import fetch from 'fetch';

export default DS.Adapter.extend({
  defaultSerializer: '-addon-docs',
  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return fetch(`${this.namespace}/${id}.json`).then(response => response.json());
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
});
