import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { classify } from '@ember/string';
import { addonPrefix } from 'ember-cli-addon-docs/utils/computed';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { action } from '@ember/object';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

/**
  Render a header showing a link to your documentation, your project logo, a
  search bar, and a link to your repo on GitHub.

  Yields a `link` contextual component which can be used to add additional
  header links.

  ```hbs
  <DocsHeader as |header|>
    <header.link @route="sandbox">
      Sandbox
    </header.link>
  </DocsHeader>
  ```

  @class DocsHeader
  @public
  @yield {Hash} header
  @yield {Component} header.link
*/
export default class DocsHeader extends Component {
  @service projectVersion;

  @addonDocsConfig config;

  @tracked query;

  constructor() {
    super(...arguments);

    this.projectVersion.loadAvailableVersions();
  }

  /**
    The prefix of your project, typically "Ember", "EmberCLI" or "EmberData".

    By default the prefix will be autodiscovered from the `name` field of your addon's package.json.

    ```hbs
    <DocsHeader @prefix="EmberData"/>
    ```

    @argument prefix
    @type String?
  */
  get prefix() {
    return this.args.prefix ?? addonPrefix(this.config.projectName);
  }

  /**
    The name of your project (without the "ember", "ember-cli" or "ember-data" prefix).

    By default the name will be autodiscovered from the `name` field of your addon's package.json.

    ```hbs
    <DocsHeader @name="MyProject"/>
    ```

    @argument name
    @type String?
  */
  get name() {
    if (this.args.name) {
      return this.args.name;
    } else {
      let name = this.config.projectName;
      name = name.replace('ember-data-', '');
      name = name.replace('ember-cli-', '');
      name = name.replace('ember-', '');

      return classify(name);
    }
  }

  @reads('projectVersion.currentVersion')
  currentVersion;

  @action
  didVisitPage() {
    this.query = null;
    let search = document.querySelector('[data-search-box-input]');
    search.blur();
  }
}
