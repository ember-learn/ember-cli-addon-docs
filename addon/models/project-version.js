import DS from 'ember-data';
import Ember from 'ember';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({

  modules: hasMany('module', { async: true }),
  classes: hasMany('class', { async: true }),

  classesSorting: ['name'],
  sortedClasses: Ember.computed.sort('classes', 'classesSorting'),

  project: belongsTo('project'),

  version: attr()

});
