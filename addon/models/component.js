import DS from 'ember-data';
import Class from './class';

const { attr } = DS;

export default Class.extend({
  isComponent: true,

  yields: attr(),
  arguments: attr()
});
