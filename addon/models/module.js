import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  path: attr(),
  variables: attr(),
  functions: attr(),

  classes: hasMany('class', { async: false, }),
  components: hasMany('class', { async: false, })
});
