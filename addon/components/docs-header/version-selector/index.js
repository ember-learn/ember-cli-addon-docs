import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

export default class VersionSelector extends Component {
  @service projectVersion;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    this.latestVersionName = config.latestVersionName;
    this.primaryBranch = config.primaryBranch;
  }

  @reads('projectVersion.currentVersion')
  currentVersion;

  get sortedVersions() {
    let latestVersionName = this.latestVersionName;
    let primaryBranch = this.primaryBranch;
    let versions = A(this.projectVersion.versions);
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

  @action
  changeVersion(version) {
    this.projectVersion.redirectTo(version);
  }
}
