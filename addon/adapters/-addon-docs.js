import Adapter from '@ember-data/adapter';
import config from 'ember-get-config';
import { inject as service } from '@ember/service';

export default Adapter.extend({
  defaultSerializer: '-addon-docs',
  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,
  docsFetch: service(),

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return this.docsFetch.fetch({ url: `${this.namespace}/${id}.json` }).json();
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
});
