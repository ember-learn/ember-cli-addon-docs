import Controller from '@ember/controller';

import { computed } from '@ember-decorators/object';

export default class ApiController extends Controller {
  @computed('model')
  get methodParams() {
    return this.get('model.methods')
      .reduce((allParams, method) => {
        let params = method.params ? method.params.map(m => m.name) : [];
        allParams[method.name] = params.join(', ');

        return allParams;
      }, {});
  }
}
