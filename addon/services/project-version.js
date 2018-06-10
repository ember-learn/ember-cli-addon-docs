import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'dummy/config/environment';

const { latestVersionName } = config['ember-cli-addon-docs'];

export default Service.extend({
  docsFetch: service(),

  _loadAvailableVersions: task(function*() {
    let response = yield this.get('docsFetch').fetch({ url: `${this.get('root')}versions.json` }).response();
    let json = yield response.ok ? response.json() : { [latestVersionName]: this.get('currentVersion') };

    this.set('versions', Object.keys(json).map(key => {
      let version = json[key];
      version.truncatedSha = version.sha.substr(0,5);

      return version;
    }));
  }),

  redirectTo(version) {
    window.location.href = `${this.get('root')}${version.path}`;
  },

  loadAvailableVersions() {
    return this.get('_loadAvailableVersions').perform();
  },

  root: computed('currentVersion.path', function() {
    let rootURL = getOwner(this).resolveRegistration('config:environment').rootURL;
    return rootURL.replace(`/${this.get('currentVersion.path')}/`, '/');
  }),

  currentVersion: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment')['ember-cli-addon-docs'];
    let currentVersion = config.deployVersion;

    // In development, this token won't have been replaced replaced
    if (currentVersion === 'ADDON_DOCS_DEPLOY_VERSION') {
      currentVersion = {
        name: latestVersionName,
        tag: config.projectTag,
        path: '',
        sha: 'abcde'
      };
    }

    return currentVersion;
  })

});
