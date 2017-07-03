import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({

  classes: hasMany('class', { async: true }),
  modules: hasMany('module', { async: true }),

  project: belongsTo('project'),

  version: attr()

});
