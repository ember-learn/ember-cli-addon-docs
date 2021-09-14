import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

export default Service.extend({
  init() {
    this._super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { deployVersion, latestVersionName, projectTag } = config;

    this.setProperties({ deployVersion, latestVersionName, projectTag });
  },
  _loadAvailableVersions: task(function* () {
    let response = yield fetch(`${this.root}versions.json`);
    let json;
    if (response.ok) {
      json = yield response.json();
    } else {
      json = {
        [this.latestVersionName]: Object.assign({}, this.currentVersion),
      };
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

  currentVersion: computed('deployVersion', 'latestVersionName', 'projectTag', {
    get() {
      let currentVersion = this.deployVersion;

      // In development, this token won't have been replaced replaced
      if (currentVersion === 'ADDON_DOCS_DEPLOY_VERSION') {
        currentVersion = {
          key: this.latestVersionName,
          name: this.latestVersionName,
          tag: this.projectTag,
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
