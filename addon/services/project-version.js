import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { resolve } from 'rsvp';

export default Service.extend({
  ajax: service(),

  current: null,
  root: null,

  init() {
    let { rootURL } = getOwner(this).resolveRegistration('config:environment');
    let slash = rootURL.indexOf('/', 1);

    this.set('root', rootURL.slice(0, slash));

    if (slash === -1) {
      this.set('current', 'development');
      this.set('_versionsPromise', resolve([{ name: 'development', path: '' }]));
    } else {
      this.set('current', rootURL.substring(slash + 1).replace(/\/$/, ''));
      this.set('_versionsPromise', this.get('ajax').request(`${this.get('root')}/versions.json`)
        .then(json => Object.keys(json).map(key => json[key])));
    }
  },

  redirectTo(version) {
    window.location.href = `${this.get('root')}/${version.path || version}`;
  },

  getAvailableVersions() {
    return this.get('_versionsPromise');
  }
});
