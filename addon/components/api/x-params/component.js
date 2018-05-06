import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  /**
   * Params shouldn't be displayed when there are no descriptions and no subparams,
   * because the information is already displayed in the type signature and redundant
   */
  shouldDisplayParams: computed('params.[]', function() {
    let params = this.get('params') || [];

    return params.some(p => p.description || p.name.includes('.'));
  })
});
