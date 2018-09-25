import Component from '@ember/component';
import layout from './template';
import { addonPrefix } from 'ember-cli-addon-docs/utils/computed';
import config from 'dummy/config/environment';
const { projectName } = config['ember-cli-addon-docs'];

/**
  A component that renders a hero banner. Useful for your docs site's homepage.

  ```hbs
  {{docs-hero
    prefix='Ember'
    headding='SuperAddon'
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

    @argument logo
    @type String
  */
  prefix: addonPrefix(projectName),

  /**
    The logo's main heading

    @argument heading
    @type String
  */
  heading: '',

  /**
    Byline for the logo

    @argument byline
    @type String
  */
  byline: ''
});
