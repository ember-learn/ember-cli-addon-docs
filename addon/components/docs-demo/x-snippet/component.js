import Ember from 'ember';

const Component = Ember.Component.extend({
  init() {
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', () => {
      this.get('did-init')(this.getProperties('name', 'label', 'language'))
    });
  }

});

Component.reopenClass({
  positionalParams: ['name']
});

export default Component;
