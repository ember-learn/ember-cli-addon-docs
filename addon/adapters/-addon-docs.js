import Adapter from '@ember-data/adapter';
import { getOwner } from '@ember/application';
import fetch from 'fetch';

export default class AddonDocsAdapter extends Adapter {
  defaultSerializer = '-addon-docs';

  get namespace() {
    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];

    const rootURL = config?.rootURL ?? '';

    return `${rootURL.replace(/\/$/, '')}/docs`;
  }

  shouldBackgroundReloadAll() {
    return false;
  }

  shouldBackgroundReloadRecord() {
    return false;
  }

  findRecord(store, modelClass, id, snapshot) {
    if (modelClass.modelName === 'project') {
      return fetch(`${this.namespace}/${id}.json`).then((response) =>
        response.json()
      );
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
}
