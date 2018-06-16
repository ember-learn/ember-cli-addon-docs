import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';
import { sort } from '@ember/object/computed';
import { reads } from '@ember/object/computed';
import config from 'dummy/config/environment';

const { latestVersionName, primaryBranch } = config['ember-cli-addon-docs'];

export default Component.extend({
  layout,

  latestVersionName,
  primaryBranch,

  projectVersion: service(),
  'on-close'() {},

  currentVersion: reads('projectVersion.currentVersion'),

  sortedVersions: sort('projectVersion.versions', function(a, b) {
    if ([latestVersionName, primaryBranch].includes(a.key) || [latestVersionName, primaryBranch].includes(b.key) ) {
      return a.key > b.key;
    } else {
      return a.key < b.key;
    }
  }),

  actions: {
    changeVersion(version) {
      this.get('projectVersion').redirectTo(version);
    }
  }

});
