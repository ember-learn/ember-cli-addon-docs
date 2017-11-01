import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    // BEGIN-SNIPPET docs-demo-multiple
    toggleIsShowing() {
      this.toggleProperty('isShowing');
    }
    // END-SNIPPET
  }

});
