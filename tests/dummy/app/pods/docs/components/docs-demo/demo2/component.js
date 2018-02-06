import Component from '@ember/component';

export default Component.extend({

  actions: {
    // BEGIN-SNIPPET docs-demo-multiple
    toggleIsShowing() {
      this.toggleProperty('isShowing');
    }
    // END-SNIPPET
  }
  
});
