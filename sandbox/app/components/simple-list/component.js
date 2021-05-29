/** @documenter yuidoc */

import Component from '@ember/component';

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

  @class SimpleList
  @public
  @yield {SimpleListItem} item
*/
export default class SimpleList extends Component {
  /**
   *  The items for the list
   *   @argument items
   *   @type object
   */
  items;
}
