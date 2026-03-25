import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import {
  addonDocsConfig,
  getRootURL,
} from 'ember-cli-addon-docs/-private/config';

export default class ProjectVersionService extends Service {
  @tracked versions;

  @addonDocsConfig config;

  _loadAvailableVersions = task(async () => {
    let fastboot = getOwner(this).lookup('service:fastboot');
    if (fastboot?.isFastBoot) {
      this.versions = [
        {
          ...this.currentVersion,
          truncatedSha: this.currentVersion.sha?.substr(0, 5) || '',
          key: this.config.latestVersionName,
        },
      ];
      return;
    }

    let response = await fetch(`${this.root}versions.json`);
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      json = {
        [this.config.latestVersionName]: Object.assign({}, this.currentVersion),
      };
    }

    this.versions = Object.keys(json).map((key) => {
      let version = json[key];
      version.truncatedSha = version.sha.substr(0, 5);
      version.key = key;

      return version;
    });
  });

  redirectTo(version) {
    if (typeof window === 'undefined') return;
    window.location.href = `${this.root}${version.path}`;
  }

  loadAvailableVersions() {
    return this._loadAvailableVersions.perform();
  }

  get root() {
    return getRootURL(this).replace(`/${this.currentVersion.path}/`, '/');
  }

  get currentVersion() {
    if (this._currentVersion) {
      return this._currentVersion;
    }

    let currentVersion = this.config.deployVersion;

    // In development, this token won't have been replaced replaced
    if (currentVersion === 'ADDON_DOCS_DEPLOY_VERSION') {
      currentVersion = {
        key: this.config.latestVersionName,
        name: this.config.latestVersionName,
        tag: this.config.projectTag,
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
