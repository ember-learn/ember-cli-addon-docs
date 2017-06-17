import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({

  classes: hasMany('class', { async: true }),
  modules: hasMany('module', { async: true }),
  namespaces: hasMany('namespace', { async: true }),
  'public-classes': hasMany('class', { async: true }),
  'private-classes': hasMany('class', { async: true }),
  'public-modules': hasMany('module', { async: true }),
  'private-modules': hasMany('module', { async: true }),
  'public-namespaces': hasMany('namespace', { async: true }),
  'private-namespaces': hasMany('namespace', { async: true }),

  project: belongsTo('project'),

  version: attr()

});
