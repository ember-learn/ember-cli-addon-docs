import { tagName } from '@ember-decorators/component';
import { equal } from '@ember/object/computed';
import { assert } from '@ember/debug';
import Component from '@ember/component';

/**
  A simple component to render an Ember, Ember CLI or Ember Data logo.

  @class DocsLogo
  @public
*/

@tagName('')
export default class DocsLogo extends Component {
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
  logo = 'ember';

  @equal('logo', 'ember')
  showEmber;

  @equal('logo', 'ember-cli')
  showEmberCli;

  @equal('logo', 'ember-data')
  showEmberData;

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    let logo = this.logo;
    let validLogos = ['ember', 'ember-cli', 'ember-data'];
    assert(
      `You passed "${logo}" to the docs-logo component, but the only valid options are [${validLogos}].`,
      validLogos.includes(logo)
    );
  }
}
