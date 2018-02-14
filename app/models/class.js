import { readOnly, filterBy } from '@ember/object/computed';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import DS from 'ember-data';
const { attr, belongsTo } = DS;

export default DS.Model.extend({

  parentClass: belongsTo('class', { async: false, inverse: null }),
  projectVersion: belongsTo('project-version', { async: false, inverse: 'classes' }),

  project: readOnly('projectVersion.project'),

  name: attr(),
  methods: attr(),
  properties: attr(),
  access: attr(),
  events: attr(),
  description: attr(),
  ogDescription: attr(),
  extends: attr(),
  uses: attr(),
  file: attr(),
  line: attr(),
  module: attr(),

  sortedMethods: computed('methods.@each.name', function() {
    return A(this.get('methods')).sortBy('name');
  }),

  publicMethods: filterBy('sortedMethods', 'access', 'public'),
  publicProperties: filterBy('properties', 'access', 'public'),

});
