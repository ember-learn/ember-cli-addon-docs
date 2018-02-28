import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  parentClass: belongsTo('class', { async: false, inverse: null }),

  isClass: true,

  name: attr(),
  file: attr(),
  exportType: attr(),
  description: attr(),
  lineNumber: attr(),
  access: attr(),

  accessors: attr(),
  methods: attr(),
  fields: attr(),
  tags: attr()
});
