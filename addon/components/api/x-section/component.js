import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

/**
  @class Api/XSection
  @hide
*/
export default Component.extend({
  layout,
  tagName: '',

  /**
   * Params shouldn't be displayed when there are no descriptions and no subparams,
   * because the information is already displayed in the type signature and redundant
   *
   * @function
   * @hide
   */
  shouldDisplayParams: computed('item.params.[]', function() {
    let params = this.get('item.params') || [];

    return params.some(p => p.description || p.name.includes('.'));
  }),
});
