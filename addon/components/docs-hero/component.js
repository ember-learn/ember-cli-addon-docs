import Component from '@ember/component';
import layout from './template';

/**
  A component that renders a hero banner. Useful for your docs site's homepage.

  ```hbs
  {{docs-hero
    logo='ember'
    slimHeading='Super'
    strongHeading='Addon'
    byline='The best addon ever. Now playing in theaters.'}}
  ```

  @class DocsHero
  @public
*/
export default Component.extend({
  layout,
  tagName: '',

  /**
    The logo to show, one of: 'ember', 'ember-cli', or 'ember-data'

    @argument logo
    @type String
  */
  logo: '',

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
