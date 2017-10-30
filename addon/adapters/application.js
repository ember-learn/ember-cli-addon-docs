import Ember from 'ember';
import DS from 'ember-data';
import config from 'dummy/config/environment';

export default DS.JSONAPIAdapter.extend({

  namespace: `${config.rootURL.replace(/\/$/, '')}/docs`,

  projectVersion: Ember.inject.service(),

  buildURL(modelName, id, snapshot, requestType, query) {
    let url = this._super(...arguments);
    let namespace = this.get('namespace');

    if (modelName !== 'project') {
      let version = this.get('projectVersion');
      url = `${namespace}/${version.version}/${url.substr(namespace.length + 1)}`;
    }

    return `${url}.json`;
  },

  shouldBackgroundReloadAll() {
    return false;
  },
  shouldBackgroundReloadRecord() {
    return false;
  }

});
