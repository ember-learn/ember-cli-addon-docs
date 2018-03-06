import Component from '@ember/component';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  {{yuidoc-component foo='bar'}}
  ```

  @class YUIDocComponent
  @public
*/
export default Component.extend({

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
