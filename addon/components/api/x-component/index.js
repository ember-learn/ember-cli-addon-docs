import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { capitalize } from '../../../utils/string';
import { filterMembers } from '../../../utils/computed';

export default class XComponent extends Component {
  @tracked showInherited = false;
  @tracked showInternal = false;
  @tracked showProtected = false;
  @tracked showPrivate = false;
  @tracked showDeprecated = false;

  get yields() {
    return this.args.component.overloadedYields;
  }

  get arguments() {
    return filterMembers(this.args.component, 'arguments', this);
  }

  get accessors() {
    return filterMembers(this.args.component, 'accessors', this);
  }

  get methods() {
    return filterMembers(this.args.component, 'methods', this);
  }

  get fields() {
    return filterMembers(this.args.component, 'fields', this);
  }

  get hasToggles() {
    let c = this.args.component;
    return !!(
      c.hasInherited ||
      c.hasInternal ||
      c.hasProtected ||
      c.hasPrivate ||
      c.hasDeprecated
    );
  }

  get hasContents() {
    let component = this.args.component;

    return (
      component.overloadedYields.length > 0 ||
      component.arguments.length > 0 ||
      component.fields.length > 0 ||
      component.accessors.length > 0 ||
      component.methods.length > 0
    );
  }

  @action
  updateFilter(filter, { target: { checked } }) {
    this[`show${capitalize(filter)}`] = checked;
  }
}
