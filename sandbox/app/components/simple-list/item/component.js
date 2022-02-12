/** @documenter yuidoc */

import Component from '@glimmer/component';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
    <SimpleList::Item @value={{1}}/>
  ```

  @class SimpleListItem
  @public
  @yield {object} value
*/
export default class SimpleListItem extends Component {
  /**
   * The count
   * @argument value
   * @type object
   */
  value;
}
