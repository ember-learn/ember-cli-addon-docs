import Model, { attr, hasMany } from '@ember-data/model';

export default class Project extends Model {
  @attr
  name;

  @attr
  githubUrl;

  @attr
  version;

  @attr
  navigationIndex;

  @hasMany('module', { async: false, inverse: null })
  modules;
}
