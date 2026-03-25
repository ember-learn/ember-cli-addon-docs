/* eslint-disable ember/classic-decorator-hooks */
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { getOwner } from '@ember/application';

export default class DocsModalDialog extends ModalDialog {
  init() {
    super.init(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');
    let fastboot = getOwner(this).lookup('service:fastboot');
    this.set(
      'renderInPlace',
      config.environment === 'test' || fastboot?.isFastBoot,
    );
  }
}
