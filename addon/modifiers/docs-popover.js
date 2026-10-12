import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { openAnchoredPopover } from 'ember-cli-addon-docs/-private/popover';

/**
  Shows the element as an anchored popover for as long as it is rendered.

  ```hbs
  <div
    popover="manual"
    class="docs-popover"
    {{docs-popover
      anchor="[data-search-box]"
      placement="bottom-start"
      onClose=@onClose
    }}
  >
    <ul class="docs-bg-white docs-shadow-md">
      ...
    </ul>
  </div>
  ```

  The popover is opened when the element is inserted, re-opened (with the new
  options) whenever one of the named arguments changes, and hidden again when
  the element is removed. See `openAnchoredPopover` for the available options.

  @class DocsPopoverModifier
  @private
*/
export default class DocsPopoverModifier extends Modifier {
  _close = null;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, () => this.close());
  }

  modify(element, positional, named) {
    this.close();
    this._close = openAnchoredPopover(element, named);
  }

  close() {
    this._close?.();
    this._close = null;
  }
}
