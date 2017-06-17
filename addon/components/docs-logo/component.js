import Ember from 'ember';
import layout from './template';

/**
  A simple component to render an Ember or EmberCLI logo.
  @class DocsLogo
  @public
*/
export default Ember.Component.extend({
  layout,

  /**
    Render either the 'ember' or 'ember-cli' logo:

    ```handlebars
    {{docs-logo logo='ember'}}
    {{docs-logo logo='ember-cli'}}
    ```

    @property logo
    @public
  */
  logo: '',
  'slim-heading': '',
  'strong-heading': '',
  'byline': '',

  showEmber: Ember.computed.equal('logo', 'ember'),
  showEmberCli: Ember.computed.equal('logo', 'ember-cli')
});
