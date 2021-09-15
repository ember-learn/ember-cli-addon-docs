import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  addonPrefix,
  unprefixedAddonName,
} from 'ember-cli-addon-docs/utils/computed';
import { getOwner } from '@ember/application';
import { classify } from '@ember/string';

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
  @tracked projectDescription;
  @tracked projectName;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectDescription, projectName } = config;
    this.projectDescription = projectDescription;
    this.projectName = projectName;
  }

  /**
    The prefix to show, typically of: 'Ember', 'EmberCLI', or 'EmberData'

    @argument prefix
    @type String
  */
  get prefix() {
    return this.args.prefix ?? addonPrefix(this.projectName);
  }

  /**
    The logo's main heading

    @argument heading
    @type String
  */
  get heading() {
    return this.args.heading ?? classify(unprefixedAddonName(this.projectName));
  }

  /**
    Byline for the logo

    @argument byline
    @type String
  */
  get byline() {
    return this.args.byline ?? this.projectDescription;
  }
}
