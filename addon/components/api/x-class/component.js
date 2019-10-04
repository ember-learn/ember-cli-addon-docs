import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import { memberFilter }  from '../../../utils/computed';
import config from 'ember-get-config';

const { showImportPaths } = config['ember-cli-addon-docs'];

import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  showImportPaths,

  showInherited: false,
  showProtected: false,
  showPrivate: false,
  showDeprecated: false,

  accessors: memberFilter('class', 'accessors'),
  methods: memberFilter('class', 'methods'),
  fields: memberFilter('class', 'fields'),

  hasToggles: or(
    'component.hasInherited',
    'component.hasProtected',
    'component.hasPrivate',
    'component.hasDeprecated',
  ),

  hasContents: computed('class', {
    get() {
      let klass = this.get('class');

      return klass.get('allFields.length') > 0
        || klass.get('allAccessors.length') > 0
        || klass.get('allMethods.length') > 0;
    }
  }),

  actions: {
    updateFilter(filter, { target: { checked } }) {
      this.set(`show${capitalize(filter)}`, checked);
    }
  }
});
