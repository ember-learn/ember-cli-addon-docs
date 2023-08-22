import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import { memberFilter } from '../../../utils/computed';

export default class XComponent extends Component {
  @tracked showInherited = false;
  @tracked showInternal = false;
  @tracked showProtected = false;
  @tracked showPrivate = false;
  @tracked showDeprecated = false;

  @alias('args.component.overloadedYields')
  yields;

  @memberFilter('args.component', 'arguments')
  arguments;

  @memberFilter('args.component', 'accessors')
  accessors;

  @memberFilter('args.component', 'methods')
  methods;

  @memberFilter('args.component', 'fields')
  fields;

  @or(
    'args.component.hasInherited',
    'args.component.hasInternal',
    'args.component.hasProtected',
    'args.component.hasPrivate',
    'args.component.hasDeprecated',
  )
  hasToggles;

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
