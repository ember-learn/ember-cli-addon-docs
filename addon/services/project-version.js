import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import fetch from 'fetch';

const { latestVersionName } = config['ember-cli-addon-docs'];

export default Service.extend({
  _loadAvailableVersions: task(function* () {
    let response = yield fetch(`${this.root}versions.json`);
    let json;
    if (response.ok) {
      json = yield response.json();
    } else {
      json = { [latestVersionName]: Object.assign({}, this.currentVersion) };
    }

    this.set(
      'versions',
      Object.keys(json).map((key) => {
        let version = json[key];
        version.truncatedSha = version.sha.substr(0, 5);
        version.key = key;

        return version;
      })
    );
  }),

  redirectTo(version) {
    window.location.href = `${this.root}${version.path}`;
  },

  loadAvailableVersions() {
    return this._loadAvailableVersions.perform();
  },

  root: computed('currentVersion.path', function () {
    let rootURL =
      getOwner(this).resolveRegistration('config:environment').rootURL;
    return rootURL.replace(`/${this.get('currentVersion.path')}/`, '/');
  }),

  currentVersion: computed({
    get() {
      let config =
        getOwner(this).resolveRegistration('config:environment')[
          'ember-cli-addon-docs'
        ];
      let currentVersion = config.deployVersion;

      // In development, this token won't have been replaced replaced
      if (currentVersion === 'ADDON_DOCS_DEPLOY_VERSION') {
        currentVersion = {
          key: latestVersionName,
          name: latestVersionName,
          tag: config?.projectTag,
          path: '',
          sha: 'abcde',
        };
      }

      return currentVersion;
    },

    set(key, val) {
      return val;
    },
  }),
});
