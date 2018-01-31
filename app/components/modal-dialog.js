import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { on } from '@ember/object/evented';
import $ from 'jquery';

export default ModalDialog.extend({

  setup: on('didInsertElement', function() {
    $('body').on('keyup.modal-dialog', (e) => {
      if (e.keyCode === 27) {
        this.sendAction('onClose'); // eslint-disable-line ember/closure-actions
      }
    });
  }),

  teardown: on('willDestroyElement', function() {
    $('body').off('keyup.modal-dialog');
  })

});
