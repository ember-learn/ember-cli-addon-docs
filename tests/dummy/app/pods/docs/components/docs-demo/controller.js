import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    toggleIsShowing() {
      this.toggleProperty('isShowing');
    },
  },
});
