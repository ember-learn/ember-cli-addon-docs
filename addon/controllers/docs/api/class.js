import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({

  methodParams: computed('model', function() {
    return this.get('model.methods')
      .reduce((allParams, method) => {
        let params = method.params ? method.params.map(m => m.name) : [];
        allParams[method.name] = params.join(', ');

        return allParams;
      }, {});
  })

});
