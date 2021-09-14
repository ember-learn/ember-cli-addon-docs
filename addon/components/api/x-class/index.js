import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { or } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import { memberFilter } from '../../../utils/computed';

export default Component.extend({
  tagName: '',

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
    'component.hasDeprecated'
  ),

  hasContents: computed('class', {
    get() {
      let klass = this.class;

      return (
        klass.get('allFields.length') > 0 ||
        klass.get('allAccessors.length') > 0 ||
        klass.get('allMethods.length') > 0
      );
    },
  }),

  init() {
    this._super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { showImportPaths } = config;

    this.set('showImportPaths', showImportPaths);
  },

  actions: {
    updateFilter(filter, { target: { checked } }) {
      this.set(`show${capitalize(filter)}`, checked);
    },
  },
});
