import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { or } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import { memberFilter } from '../../../utils/computed';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class XClass extends Component {
  @addonDocsConfig config;

  @tracked showInherited = false;
  @tracked showProtected = false;
  @tracked showPrivate = false;
  @tracked showDeprecated = false;

  @memberFilter('args.class', 'accessors')
  accessors;

  @memberFilter('args.class', 'methods')
  methods;

  @memberFilter('args.class', 'fields')
  fields;

  @or(
    'component.hasInherited',
    'component.hasProtected',
    'component.hasPrivate',
    'component.hasDeprecated',
  )
  hasToggles;

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
