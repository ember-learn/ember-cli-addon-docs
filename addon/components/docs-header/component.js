import Component from '@ember/component';
import layout from './template';
import config from 'ember-get-config';
import { computed } from '@ember/object';
import { classify } from '@ember/string';
import { addonLogo, addonPrefix } from 'ember-cli-addon-docs/utils/computed';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const { projectName, projectHref, latestVersionName } = config['ember-cli-addon-docs'];

/**
  Render a header showing a link to your documentation, your project logo, a
  search bar, and a link to your repo on GitHub.

  Yields a `link` contextual component which can be used to add additional
  header links.

  ```hbs
  {{#docs-header as |header|}}
    {{#header.link 'sandbox'}}
      Sandbox
    {{/header.link}}
  {{/docs-header}}
  ```

  @class DocsHeader
  @public
  @yield {Hash} header
  @yield {Component} header.link
*/
export default Component.extend({
  layout,
  tagName: '',

  projectVersion: service(),

  projectHref,
  latestVersionName,

  didInsertElement() {
    this._super(...arguments);

    this.get('projectVersion').loadAvailableVersions();
  },

  logo: classify(addonLogo(projectName)),

  /**
    The prefix of your project, typically "Ember", "EmberCLI" or "EmberData".

    By default the prefix will be autodiscovered from the `name` field of your addon's package.json.

    ```hbs
    {{docs-header prefix='EmberData'}}
    ```

    @argument prefix
    @type String?
  */
  prefix: addonPrefix(projectName),

  /**
    The name of your project (without the "ember", "ember-cli" or "ember-data" prefix).

    By default the name will be autodiscovered from the `name` field of your addon's package.json.

    ```hbs
    {{docs-header name='MyProject'}}
    ```

    @argument name
    @type String?
  */
  name: computed(function() {
    let name = projectName;
    name = name.replace('ember-data-', '');
    name = name.replace('ember-cli-', '');
    name = name.replace('ember-', '');

    return classify(name);
  }),

  currentVersion: reads('projectVersion.currentVersion'),

  actions: {
    didVisitPage() {
      this.set('query', null);
      let search = document.querySelector('[data-search-box-input]');
      search.blur();
    }
  }

});
