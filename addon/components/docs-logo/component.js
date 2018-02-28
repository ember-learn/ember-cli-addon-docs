import { equal } from '@ember/object/computed';
import { assert } from '@ember/debug';
import Component from '@ember/component';
import layout from './template';

/**
  A simple component to render an Ember, Ember CLI or Ember Data logo.

  @class DocsLogo
  @public
*/
export default Component.extend({
  layout,
  tagName: '',

  /**
    Render either the 'ember', 'ember-cli' or 'ember-data' logo:

    ```handlebars
    {{docs-logo logo='ember'}}
    {{docs-logo logo='ember-cli'}}
    {{docs-logo logo='ember-data'}}
    ```

    @argument logo
    @type String
  */
  logo: 'ember',

  didReceiveAttrs() {
    this._super(...arguments);

    let logo = this.get('logo');
    let validLogos = ['ember', 'ember-cli', 'ember-data'];
    assert(`You passed "${logo}" to the docs-logo component, but the only valid options are [${validLogos}].`, validLogos.includes(logo));
  },

  showEmber: equal('logo', 'ember'),
  showEmberCli: equal('logo', 'ember-cli'),
  showEmberData: equal('logo', 'ember-data')
});
