import Component from '@glimmer/component';
import {
  addonPrefix,
  unprefixedAddonName,
} from 'ember-cli-addon-docs/utils/computed';
import { classify } from '@ember/string';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

/**
  A component that renders a hero banner. Useful for your docs site's homepage.

  ```hbs
  <DocsHero
    @prefix="Ember"
    @heading="SuperAddon"
    @byline="The best addon ever. Now playing in theaters."
  />
  ```

  @class DocsHero
  @public
*/
export default class DocsHeroComponent extends Component {
  @addonDocsConfig config;

  /**
    The prefix to show, typically of: 'Ember', 'EmberCLI', or 'EmberData'

    @argument prefix
    @type String
  */
  get prefix() {
    return this.args.prefix ?? addonPrefix(this.config.projectName);
  }

  /**
    The logo's main heading

    @argument heading
    @type String
  */
  get heading() {
    return (
      this.args.heading ??
      classify(unprefixedAddonName(this.config.projectName))
    );
  }

  /**
    Byline for the logo

    @argument byline
    @type String
  */
  get byline() {
    return this.args.byline ?? this.config.projectDescription;
  }
}
