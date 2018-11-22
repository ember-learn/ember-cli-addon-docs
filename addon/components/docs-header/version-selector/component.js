import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';
import { reads } from '@ember/object/computed';
// import config from 'dummy/config/environment';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

// const { latestVersionName, primaryBranch } = config['ember-cli-addon-docs'];
//
export default Component.extend({
  layout,

  latestVersionName: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment')['ember-cli-addon-docs'];

    return config.latestVersionName;
  }),

  primaryBranch: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment')['ember-cli-addon-docs'];

    return config.primaryBranch;
  }),

  projectVersion: service(),
  'on-close'() {},

  currentVersion: reads('projectVersion.currentVersion'),

  sortedVersions: computed('projectVersion.versions', 'latestVersionName', 'primaryBranch', function() {
    let latestVersionName = this.get('latestVersionName');
    let primaryBranch = this.get('primaryBranch');
    let versions = A(this.get('projectVersion.versions'));
    let latest = versions.findBy('key', latestVersionName);
    let primary = versions.findBy('key', primaryBranch);

    return [
      latest,
      primary,
      ...versions.removeObjects([ latest, primary ]).sortBy('key')
    ].filter(Boolean);
  }),

  actions: {
    changeVersion(version) {
      this.get('projectVersion').redirectTo(version);
    }
  }

});
