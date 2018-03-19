import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import config from 'dummy/config/environment';
import { classify } from '@ember/string';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Component.extend({
  layout,
  tagName: 'nav',
  classNames: 'docs-viewer__nav',

  root: 'docs',

  store: service(),
  packageJson,

  addonLogo: computed(function() {
    let name = packageJson.name;
    let logo;
    if (name.match(/ember-cli/)) {
      logo = 'ember-cli';
    } else if (name.match(/ember-data/)) {
      logo = 'ember-data';
    } else {
      logo = 'ember';
    }

    return logo;
  }),

  addonTitle: computed('addonLogo', function() {
    let logo = this.get('addonLogo');

    return classify(packageJson.name.replace(`${logo}-`, ''));
  }),

  releasesUrl: `${packageJson.repository}/releases`,

  project: computed(function() {
    return this.get('store').peekRecord('project', packageJson.name);
  })
});
