import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import config from 'ember-get-config';
import { classify } from '@ember/string';
import { addonLogo } from 'ember-cli-addon-docs/utils/computed';

const projectName = config['ember-cli-addon-docs'].projectName;

export default Component.extend({
  layout,
  tagName: '',

  root: 'docs',

  store: service(),

  addonLogo: addonLogo(projectName),

  addonTitle: computed('addonLogo', function() {
    let logo = this.get('addonLogo');

    return classify(projectName.replace(`${logo}-`, ''));
  }),

  /*
    This is overwritten for the Sandbox.
  */
  project: computed(function() {
    return this.get('store').peekRecord('project', projectName);
  })
});
