import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({

  host: '/docs',

  projectVersion: Ember.inject.service(),

  buildURL(modelName, id, snapshot, requestType, query) {
    let url = this._super(...arguments);

    if (modelName !== 'project') {
      let version = this.get('projectVersion');
      url = `/docs/${version.version}/${url.substr(5)}`;
    }

    return `${url}.json`;
  }

});
