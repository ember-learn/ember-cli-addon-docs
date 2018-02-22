import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  name: attr(),
  githubUrl: attr(),
  version: attr(),
  navigationIndex: attr(),
  modules: hasMany('module', { async: false })
});
