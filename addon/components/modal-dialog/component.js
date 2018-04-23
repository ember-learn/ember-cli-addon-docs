import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default ModalDialog.extend({

  renderInPlace: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment')
    
    return config.environment === 'test';
  })

});
