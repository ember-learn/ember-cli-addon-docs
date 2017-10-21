import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;
const { attr, belongsTo } = DS;

export default DS.Model.extend({

  parentClass: belongsTo('class', { async: true, inverse: null }),
  projectVersion: belongsTo('project-version', { inverse: 'classes' }),

  project: computed.readOnly('projectVersion.project'),

  name: attr(),
  methods: attr(),
  properties: attr(),
  access: attr(),
  events: attr(),
  description: attr(),
  ogDescription: attr(),
  extends: attr(),
  uses: attr(),
  file: attr(),
  line: attr(),
  module: attr(),

  sortedMethods: computed('methods.@each.name', function() {
    return Ember.A(this.get('methods')).sortBy('name');
  })

});
