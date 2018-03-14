import Component from '@ember/component';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import { memberFilter }  from '../../../utils/computed';

import layout from './template';

export default Component.extend({
  layout,

  showInherited: false,
  showProtected: false,
  showPrivate: false,
  showDeprecated: false,

  accessors: memberFilter('class', 'accessors'),
  methods: memberFilter('class', 'methods'),
  fields: memberFilter('class', 'fields'),

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
