import Ember from 'ember';
import layout from './template';

/**
 This has to exist to satisfy an assumption the doc viewer makes that at least one namespace exists in a project.

 @class MyNamespace
 @static
 */


/**
  Pretty cool component, right?

  ```handlebars
  {{sample-component foo='bar'}}
  ```

  @class SampleComponent
  @public
*/
export default Ember.Component.extend({

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
