import Route from '@ember/routing/route';

export default Route.extend({

  beforeModel() {
    let parentModel = this.modelFor('api');
    let modules = parentModel.getWithDefault('navigationIndex.modules', []);
    if (modules.length) {
      return this.transitionTo('api.item', modules[0].path);
    }
    return this.transitionTo('docs');
  }
});
