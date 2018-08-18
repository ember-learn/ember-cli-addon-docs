import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  file: attr(),
  variables: attr(),
  functions: attr(),

  classes: hasMany('class', { async: false, }),
  components: hasMany('class', { async: false, }),

  /*
    This gives us a way to link to a model, since we don't always link by the actual ID:

      {{link-to 'item' model.routingId}}

    Possible refactoring is to always link by actual ID, and implement redirects.
  */
  routingId: computed('id', function() {
    return `modules/${this.get('id')}`;
  })

});
