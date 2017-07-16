import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({

  actions: {
    // BEGIN-SNIPPET docs-demo-multiple
    toggleIsShowing() {
      this.toggleProperty('isShowing');
    }
    // END-SNIPPET
  }

});
