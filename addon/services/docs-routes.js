import Ember from 'ember';

export default Ember.Service.extend({

  router: Ember.inject.service('-routing'),

  init() {
    this._super(...arguments);
    this.resetState();
  },

  resetState() {
    this.set('items', Ember.A());
  },

  currentPage: Ember.computed('items.[]', 'router.currentPath', function() {
    return this.get('items').findBy('route', this.get('router.currentPath'));
  }),

  previousPage: Ember.computed('items.[]', 'currentPage', function() {
    let currentIndex = this.get('items').indexOf(this.get('currentPage'));

    if (currentIndex > 0) {
      return this.get('items').objectAt(currentIndex - 1);
    }
  }),

  nextPage: Ember.computed('items.[]', 'currentPage', function() {
    let currentIndex = this.get('items').indexOf(this.get('currentPage'));

    if (currentIndex < this.get('items.length')) {
      return this.get('items').objectAt(currentIndex + 1);
    }
  })

});
