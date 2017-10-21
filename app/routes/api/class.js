import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return this.modelFor('docs.api')
      .get('classes')
      .findBy('id', params.class_id);
  }

});
