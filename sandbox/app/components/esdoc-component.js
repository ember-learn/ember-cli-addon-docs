/** @documenter esdoc */

import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  {{esdoc-component count=2}}

  {{#esdoc-component as |api|}}
    {{api.count}}
  {{/esdoc-component}}
  ```

  @yield {object} api
  @yield {number} api.count
  @yield {Action} api.increment
*/
export default class ESDocComponent extends Component {
  /**
    The count
  */
  @argument
  @type('number')
  count = 0;

  /**
    An action that sends on events
  */
  @argument
  @type(Action)
  onEvent;

  /**
    An awesome static value
  */
  static isESDocComponent = true;

  /**
    PRIVATE DO NOT TOUCH
  */
  _privateField = 123;

  /**
    The best method ever made, anywhere.
    @param {Object} features the features of the user
    @param {String} name the name of the user
    @return {String} the welcome message
  */
  impressUser(features, name) {
    return `${name} has features ${features}`;
  }

  /**
    Increments the count property
  */
  @action
  increment() {
    this.incrementProperty('count');
  }
}
