// import Controller from '@ember/controller';
// import { computed } from '@ember/object';
import Ember from 'ember';

export default Ember.Controller.extend({

  methodParams: Ember.computed('model', function() {
    return this.get('model.methods')
      .reduce((allParams, method) => {
        let params = method.params ? method.params.map(m => m.name) : [];
        allParams[method.name] = params.join(', ');

        return allParams;
      }, {});
  })

});
