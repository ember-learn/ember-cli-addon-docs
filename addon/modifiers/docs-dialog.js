import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

/**
  Opens a native `<dialog>` as a modal for as long as it is rendered.

  ```hbs
  <dialog closedby="any" tabindex="-1" {{docs-dialog onClose=this.hide}}>
    ...
  </dialog>
  ```

  On insert the dialog is shown with `showModal()` and focused, so the page
  behind it is inert and screen readers announce it. `onClose` is called when
  the dialog closes natively (Escape, `closedby="any"`, a form with
  `method="dialog"`, or `dialog.close()`) and when the backdrop is clicked in
  browsers that do not support `closedby`; the caller is expected to stop
  rendering the dialog in response.

  @class DocsDialogModifier
  @private
*/
export default class DocsDialogModifier extends Modifier {
  _removeListeners = null;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, () => this._removeListeners?.());
  }

  modify(dialog, positional, { onClose }) {
    if (!dialog.open) {
      dialog.showModal();
      dialog.focus();
    }

    this._removeListeners?.();
    this._removeListeners = null;

    if (!onClose) {
      return;
    }

    let handleClose = () => onClose();
    // A click whose target is the <dialog> element itself landed on its
    // ::backdrop, i.e. outside the dialog box.
    let handleClick = (event) => {
      if (event.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);
    this._removeListeners = () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }
}
