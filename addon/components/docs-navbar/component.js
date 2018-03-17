import Component from '@ember/component';
import layout from './template';
import config from 'dummy/config/environment';
import { computed } from '@ember/object';
import { classify } from '@ember/string';

const packageJson = config['ember-cli-addon-docs'].packageJson;

/**
  Render a header showing a link to your documentation, your project logo and
  a GitHub link to your addon's repository.

  @class DocsNavbar
  @public
*/
export default Component.extend({
  layout,

  tagName: '',

  packageJson: packageJson,

  addonLogo: computed(function() {
    let name = packageJson.name;
    let logo;

    if (name.match('ember-cli-')) {
      logo = 'ember-cli';
    } else if (name.match('ember-data-')) {
      logo = 'ember-data';
    } else if (name.match('ember-data-')) {
      logo = 'ember';
    }

    return logo;
  }),

  addonName: computed(function() {
    let name = packageJson.name;
    name = name.replace('ember-data-', '');
    name = name.replace('ember-cli-', '');
    name = name.replace('ember-', '');

    return classify(name);
  })

});
