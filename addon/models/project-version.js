import DS from 'ember-data';
import Ember from 'ember';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({

  version: attr(),

  project: belongsTo('project'),
  modules: hasMany('module', { async: false }),
  classes: hasMany('class', { async: false }),

  classesSorting: ['name'],
  sortedClasses: Ember.computed.sort('classes', 'classesSorting'),



});
