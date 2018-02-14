import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  name: attr(),
  githubUrl: attr(),
  projectVersions: hasMany('project-version', { async: true })
});
