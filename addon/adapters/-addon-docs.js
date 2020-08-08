import Adapter from '@ember-data/adapter';
import config from 'ember-get-config';
import fetch from 'fetch';

export default Adapter.extend({
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
      return fetch(`${this.namespace}/${id}.json`).then((response) => response.json());
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
});
