// import { filterBy } from '@ember/object/computed';
// import { A } from '@ember/array';
// import { computed } from '@ember/object';
import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  parentClass: belongsTo('class', { async: false, inverse: null }),

  name: attr(),
  file: attr(),
  exportType: attr(),
  description: attr(),
  lineNumber: attr(),
  access: attr(),

  methods: attr(),
  fields: attr(),
  tags: attr()

  // line: attr(),
  // module: attr(),

  // sortedMethods: computed('methods.@each.name', function() {
  //   return A(this.get('methods')).sortBy('name');
  // }),

  // publicMethods: filterBy('sortedMethods', 'access', 'public'),
  // publicProperties: filterBy('properties', 'access', 'public'),

});
