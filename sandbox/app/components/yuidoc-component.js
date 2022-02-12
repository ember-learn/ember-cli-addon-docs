/* eslint-disable */
/** @documenter yuidoc */

import Component from '@glimmer/component';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  {{yuidoc-component foo="bar"}}
  ```

  @class YUIDocComponent
  @public
*/
export default class YUIDocComponent extends Component {
  /**
    The count
    @argument count
    @type number
  */
  count = 0;

  /**
    An action that sends on events
    @argument onEvent
    @type Action
  */
  onEvent = null;

  /**
    PRIVATE DO NOT TOUCH

    @field _privateField
    @private
    @type number
  */
  #privateField = 123;

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

  /**
    An awesome static value

    @field isYUIDocComponent
    @static
    @type boolean
  */
  static isYUIDocComponent = true;
}
