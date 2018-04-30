/** @documenter esdoc */

import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  {{#simple-list items=(arr 1 2 3) as |item|}}
    {{#item as |value|}}
      {{value}}
    {{/item}}
  {{/simple-list}}
  ```

  @yield {SimpleListItem} item
*/
export default class SimpleList extends Component {
  /**
    The items for the list
  */
  @argument
  @type('object')
  items;
}
