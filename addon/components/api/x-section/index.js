import Component from '@glimmer/component';
import config from 'ember-get-config';

const { showImportPaths } = config['ember-cli-addon-docs'];

/**
  @class Api/XSection
  @hide
*/
export default class XSection extends Component {
  showImportPaths = showImportPaths;

  /**
   * Params shouldn't be displayed when there are no descriptions and no subparams,
   * because the information is already displayed in the type signature and redundant
   *
   * @function
   * @hide
   */
  get shouldDisplayParams() {
    let params = this.args.item?.params || [];

    return params.some((p) => p.description || p.name.includes('.'));
  }
}
