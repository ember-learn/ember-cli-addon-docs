import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { getOwner } from '@ember/application';

export default ModalDialog.extend({
  init() {
    this._super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');
    this.set('renderInPlace', config.environment === 'test');
  },
});
