import Adapter from '@ember-data/adapter';
import fetch from 'fetch';
import { getRootURL } from 'ember-cli-addon-docs/-private/config';

export default class AddonDocsAdapter extends Adapter {
  defaultSerializer = '-addon-docs';

  get namespace() {
    return `${getRootURL(this).replace(/\/$/, '')}/docs`;
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
        response.json(),
      );
    } else {
      return store.peekRecord(modelClass.modelName, id);
    }
  }
}
