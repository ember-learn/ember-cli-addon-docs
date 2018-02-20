import { assert } from '@ember/debug';
import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { equal } from '@ember-decorators/object/computed';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

import layout from './template';

/**
  A simple component to render an Ember, Ember CLI or Ember Data logo.
*/
@tagName('')
export default class DocsLogoComponent extends Component {
  layout = layout;

  /**
    Render either the 'ember', 'ember-cli' or 'ember-data' logo:

    ```handlebars
    {{docs-logo logo='ember'}}
    {{docs-logo logo='ember-cli'}}
    {{docs-logo logo='ember-data'}}
    ```
  */
  @argument({ defaultIfUndefined: true })
  @type('string')
  logo = 'ember';

  didReceiveAttrs() {
    let logo = this.get('logo');
    let validLogos = ['ember', 'ember-cli', 'ember-data'];
    assert(`You passed "${logo}" to the docs-logo component, but the only valid options are [${validLogos}].`, validLogos.includes(logo));
  }

  @equal('logo', 'ember') showEmber;
  @equal('logo', 'ember-cli') showEmbrCli;
  @equal('logo', 'ember-data') showEmberData;
}
