/** @documenter yuidoc */

import Component from '@ember/component';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
    {{simple-list/item value=1}}
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
