import Component from '@ember/component';
import layout from './template';
import { addonPrefix, unprefixedAddonName } from 'ember-cli-addon-docs/utils/computed';
import config from 'ember-get-config';
import { classify } from '@ember/string';
const { projectName, projectDescription } = config['ember-cli-addon-docs'];

/**
  A component that renders a hero banner. Useful for your docs site's homepage.

  ```hbs
  {{docs-hero
    prefix='Ember'
    heading='SuperAddon'
    byline='The best addon ever. Now playing in theaters.'}}
  ```

  @class DocsHero
  @public
*/
export default Component.extend({
  layout,
  tagName: '',

  /**
    The prefix to show, tyipcally of: 'Ember', 'EmberCLI', or 'EmberData'

    @argument prefix
    @type String
  */
  prefix: addonPrefix(projectName),

  /**
    The logo's main heading

    @argument heading
    @type String
  */
  heading: classify(unprefixedAddonName(projectName)),

  /**
    Byline for the logo

    @argument byline
    @type String
  */
  byline: projectDescription,

  /**
    Class to add to the wrapper element

    @argument class
    @type String
  */
  class: null
});
