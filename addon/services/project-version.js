import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';

const { latestVersionName } = config['ember-cli-addon-docs'];

export default class ProjectVersionService extends Service {
  @tracked versions;

  @task
  *_loadAvailableVersions() {
    let response = yield fetch(`${this.root}versions.json`);
    let json;
    if (response.ok) {
      json = yield response.json();
    } else {
      json = { [latestVersionName]: Object.assign({}, this.currentVersion) };
    }

    this.versions = Object.keys(json).map((key) => {
      let version = json[key];
      version.truncatedSha = version.sha.substr(0, 5);
      version.key = key;

      return version;
    });
  }

  redirectTo(version) {
    window.location.href = `${this.root}${version.path}`;
  }

  loadAvailableVersions() {
    return this._loadAvailableVersions.perform();
  }

  get root() {
    let rootURL =
      getOwner(this).resolveRegistration('config:environment').rootURL;
    return rootURL.replace(`/${this.currentVersion.path}/`, '/');
  }

  get currentVersion() {
    if (this._currentVersion) {
      return this._currentVersion;
    }

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
  }

  // only used for tests
  set currentVersion(val) {
    this._currentVersion = val;
  }
}
