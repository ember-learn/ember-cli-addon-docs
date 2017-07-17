import Ember from 'ember';
import layout from './template';

/**
  A simple component to render an Ember, Ember CLI or Ember Data logo.
  @class DocsLogo
  @public
*/
export default Ember.Component.extend({
  layout,

  /**
    Render either the 'ember', 'ember-cli' or 'ember-data' logo:

    ```handlebars
    {{docs-logo logo='ember'}}
    {{docs-logo logo='ember-cli'}}
    {{docs-logo logo='ember-data'}}
    ```

    @property logo
    @public
  */
  logo: 'ember',

  showEmber: Ember.computed.equal('logo', 'ember'),
  showEmberCli: Ember.computed.equal('logo', 'ember-cli'),
  showEmberData: Ember.computed.equal('logo', 'ember-data')
});
