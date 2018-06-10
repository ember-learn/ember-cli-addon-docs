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
    if ([latestVersionName, primaryBranch].includes(a.name) || [latestVersionName, primaryBranch].includes(b.name) ) {
      return a.name > b.name;
    } else {
      return a.name < b.name;
    }
  }),

  actions: {
    changeVersion(version) {
      this.get('projectVersion').redirectTo(version);
    }
  }

});
