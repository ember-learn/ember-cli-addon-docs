import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import Ember from 'ember';

export default ModalDialog.extend({

  setup: Ember.on('didInsertElement', function() {
    Ember.$('body').on('keyup.modal-dialog', (e) => {
      if (e.keyCode === 27) {
        this.sendAction('onClose');
      }
    });
  }),

  teardown: Ember.on('willDestroyElement', function() {
    Ember.$('body').off('keyup.modal-dialog');
  })

});
