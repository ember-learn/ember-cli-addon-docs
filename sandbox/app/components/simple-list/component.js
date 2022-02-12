/** @documenter yuidoc */

import Component from '@glimmer/component';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
  <SimpleList @items={{array 1 2 3}} as |item|>
    <item as |value|>
      {{value}}
    </item>
  </SimpleList>
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
