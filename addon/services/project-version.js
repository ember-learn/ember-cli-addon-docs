import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { resolve } from 'rsvp';

export default Service.extend({
  ajax: service(),

  current: null,
  root: null,

  init() {
    this._super(...arguments);

    let { rootURL } = getOwner(this).resolveRegistration('config:environment');
    let slash = rootURL.indexOf('/', 1);

    // TODO deal with apps deployed to custom domains, so their pathnames don't have a leading
    // segmenet for the project name. This will impact this service and the 404 page.
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
