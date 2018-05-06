import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import { memberFilter }  from '../../../utils/computed';

import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  showInherited: false,
  showInternal: false,
  showProtected: false,
  showPrivate: false,
  showDeprecated: false,

  yields: alias('component.overloadedYields'),

  arguments: memberFilter('component', 'arguments'),
  accessors: memberFilter('component', 'accessors'),
  methods: memberFilter('component', 'methods'),
  fields: memberFilter('component', 'fields'),

  hasToggles: or(
    'component.hasInherited',
    'component.hasInternal',
    'component.hasProtected',
    'component.hasPrivate',
    'component.hasDeprecated',
  ),

  hasContents: computed('component', {
    get() {
      let component = this.get('component');

      return component.get('overloadedYields.length') > 0
        || component.get('arguments.length') > 0
        || component.get('fields.length') > 0
        || component.get('accessors.length') > 0
        || component.get('methods.length') > 0;
    }
  }),

  actions: {
    updateFilter(filter, { target: { checked } }) {
      this.set(`show${capitalize(filter)}`, checked);
    }
  }
});
