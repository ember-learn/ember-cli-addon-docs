import { inject as service } from '@ember/service';
import DS from 'ember-data';
import config from 'dummy/config/environment';

export default DS.JSONAPIAdapter.extend({

  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,

  projectVersion: service(),

  buildURL(modelName, id, snapshot, requestType, query) {
    return `${this._super(...arguments)}.json`;
  },

  shouldBackgroundReloadAll() {
    return false;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  findRecord(store, modelClass, id, snapshot) {
    let type = modelClass.modelName;
    if (type === 'project') {
      return this._super(...arguments);
    } else if (type === 'project-version') {
      return this._projectVersion || (this._projectVersion = this._super(...arguments));
    } else {
      return this.findRecord(store, store.modelFor('project-version'), this.get('projectVersion.version'))
        .then((projectVersionDoc) => {
          let modelDoc = projectVersionDoc.included.find(doc => doc.type === type && doc.id === id);
          if (modelDoc) {
            return { data: modelDoc };
          } else {
            throw new DS.NotFoundError();
          }
        });
    }
  }

});
