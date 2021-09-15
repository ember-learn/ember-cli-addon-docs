import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

// const { latestVersionName, primaryBranch } = config['ember-cli-addon-docs'];
//
export default Component.extend({
  projectVersion: service(),

  init() {
    this._super(...arguments);
    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    this.set('latestVersionName', config.latestVersionName);
    this.set('primaryBranch', config.primaryBranch);
  },

  'on-close'() {},

  currentVersion: reads('projectVersion.currentVersion'),

  sortedVersions: computed(
    'projectVersion.versions',
    'latestVersionName',
    'primaryBranch',
    function () {
      let latestVersionName = this.latestVersionName;
      let primaryBranch = this.primaryBranch;
      let versions = A(this.get('projectVersion.versions'));
      let latest = versions.findBy('key', latestVersionName);
      let primary = versions.findBy('key', primaryBranch);
      let otherTags = versions
        .reject((v) => [latest, primary].includes(v))
        .sort((tagA, tagB) => {
          let keyA = tagA.key;
          let keyB = tagB.key;

          if (keyA > keyB) {
            return -1;
          }
          if (keyA < keyB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

      return [latest, primary, ...otherTags].filter(Boolean);
    }
  ),

  actions: {
    changeVersion(version) {
      this.projectVersion.redirectTo(version);
    },
  },
});
