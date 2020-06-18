import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr(),
  githubUrl: attr(),
  version: attr(),
  navigationIndex: attr(),
  modules: hasMany('module', { async: false })
});
