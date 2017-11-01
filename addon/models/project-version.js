import { sort } from '@ember/object/computed';
import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({

  version: attr(),

  project: belongsTo('project'),
  modules: hasMany('module', { async: false }),
  classes: hasMany('class', { async: false }),

  classesSorting: ['name'],
  sortedClasses: sort('classes', 'classesSorting'),



});
