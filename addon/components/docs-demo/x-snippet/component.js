import Ember from 'ember';

const Component = Ember.Component.extend({
  init() {
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', () => {
      this.get('did-init')(this.get('name'))
    });
  }

});

Component.reopenClass({
  positionalParams: ['name']
});

export default Component;
