import Adapter from '@ember-data/adapter';
import { getOwner } from '@ember/application';
import fetch from 'fetch';

export default Adapter.extend({
  defaultSerializer: '-addon-docs',

  init() {
    this._super(...arguments);
    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    this.set('namespace', `${config.rootURL.replace(/\/$/, '')}/docs`);
  },

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return fetch(`${this.namespace}/${id}.json`).then((response) =>
        response.json()
      );
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  },
});
