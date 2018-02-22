import DS from 'ember-data';
import Class from './class';

const { attr } = DS;

export default Class.extend({
  yields: attr(),
  arguments: attr()
});
