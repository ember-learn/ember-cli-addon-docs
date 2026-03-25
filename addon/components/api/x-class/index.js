import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { capitalize } from '../../../utils/string';
import { filterMembers } from '../../../utils/computed';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class XClass extends Component {
  @addonDocsConfig config;

  @tracked showInherited = false;
  @tracked showProtected = false;
  @tracked showPrivate = false;
  @tracked showDeprecated = false;

  get accessors() {
    return filterMembers(this.args.class, 'accessors', this);
  }

  get methods() {
    return filterMembers(this.args.class, 'methods', this);
  }

  get fields() {
    return filterMembers(this.args.class, 'fields', this);
  }

  get hasToggles() {
    let klass = this.args.class;
    return !!(
      klass.hasInherited ||
      klass.hasProtected ||
      klass.hasPrivate ||
      klass.hasDeprecated
    );
  }

  get hasContents() {
    let klass = this.args.class;

    return (
      klass.allFields.length > 0 ||
      klass.allAccessors.length > 0 ||
      klass.allMethods.length > 0
    );
  }

  updateFilter(filter, { target: { checked } }) {
    this[`show${capitalize(filter)}`] = checked;
  }
}
