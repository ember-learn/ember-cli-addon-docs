/** @documenter esdoc */

import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

/**
  Pretty cool component, right?

  To use it, you could enter the following in your template:

  ```handlebars
    {{simple-list/item value=1}}
  ```

  @yield {object} value
*/
export default class SimpleListItem extends Component {
  /**
    The count
  */
  @argument
  @type('object')
  value;
}
