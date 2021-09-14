import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';
import { getOwner } from '@ember/application';

/**
  @class Api/XSection
  @hide
*/
export default Component.extend({
  layout,
  tagName: '',

  init() {
    this._super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { showImportPaths } = config;

    this.set('showImportPaths', showImportPaths);
  },

  /**
   * Params shouldn't be displayed when there are no descriptions and no subparams,
   * because the information is already displayed in the type signature and redundant
   *
   * @function
   * @hide
   */
  shouldDisplayParams: computed('item.params.[]', function () {
    let params = this.get('item.params') || [];

    return params.some((p) => p.description || p.name.includes('.'));
  }),
});
