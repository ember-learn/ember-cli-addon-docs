import Component from '@ember/component';
import layout from './template';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  {{sample-component foo='bar'}}
  ```

  @class SampleComponent
  @public
*/
export default Component.extend({

  layout,

  /**
    The best method ever made, anywhere.
    @method impressUser
    @param {Object} features the features of the user
    @param {String} name the name of the user
    @return {String} the welcome message
    @public
  */
  impressUser(features, name) {
    return `${name} has features ${features}`;
  }

});
