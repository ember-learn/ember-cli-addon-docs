import Service from '@ember/service';
import { getOwner } from '@ember/application';
import fetch from 'fetch';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Service.extend({
  current: null,
  root: null,

  _loadAvailableVersions: task(function*() {
    let config = getOwner(this).resolveRegistration('config:environment');
    let rootURL = config.rootURL;
    let tag = config['ember-cli-addon-docs'].projectTag;
    let slash = rootURL.indexOf('/', 1);

    // TODO deal with apps deployed to custom domains, so their pathnames don't have a leading
    // segmenet for the project name. This will impact this service and the 404 page.
    this.set('root', rootURL.slice(0, slash));
    let currentFromURL = rootURL.substring(slash + 1).replace(/\/$/, '');
    this.set('current', currentFromURL || 'latest'); // dev-time guard. Think of a better way?

    let response = yield fetch(`${this.get('root')}/versions.json`);
    let json = yield response.ok ? response.json() : [{ name: 'latest', tag, sha: '12345', path: '/' }];

    this.set('versions', Object.keys(json).map(key => {
      let version = json[key];
      version.truncatedSha = version.sha.substr(0,5);

      return version;
    }));
  }),

  redirectTo(version) {
    window.location.href = `${this.get('root')}/${version.path || version}`;
  },

  loadAvailableVersions() {
    return this.get('_loadAvailableVersions').perform();
  },

  currentVersion: computed('versions.[]', function() {
    let versions = this.get('versions');

    if (versions) {
      return versions.find(version => version.name === this.get('current'));
    }
  })

});
