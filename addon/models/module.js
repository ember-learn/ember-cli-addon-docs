import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
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
    return `modules/${this.id}`;
  })
});
