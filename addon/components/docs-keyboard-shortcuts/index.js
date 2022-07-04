import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { keyResponder, onKey } from 'ember-keyboard';
import { inject as service } from '@ember/service';
import { formElementHasFocus } from '../../keyboard-config';

/**
  A component that enables keyboard shortcuts. Press '?' to toggle the keyboard shortcuts dialog.

  @class DocsKeyboardShortcuts
  @public
*/

@keyResponder
export default class DocsKeyboardShortcutsComponent extends Component {
  @service router;

  @tracked isShowingKeyboardShortcuts = false;

  @onKey('KeyG', { event: 'keyup' })
  goto() {
    if (!formElementHasFocus()) {
      this.isGoingTo = true;
      later(() => {
        this.isGoingTo = false;
      }, 500);
    }
  }

  @onKey('KeyD', { event: 'keyup' })
  gotoDocs() {
    if (!formElementHasFocus()) {
      if (this.isGoingTo) {
        this.router.transitionTo('docs');
      }
    }
  }

  @onKey('KeyH', { event: 'keyup' })
  gotoHome() {
    if (!formElementHasFocus()) {
      if (this.isGoingTo) {
        this.router.transitionTo('index');
      }
    }
  }

  @onKey('shift+Slash', { event: 'keyup' })
  toggleKeyboardShortcutsWithKeyboard() {
    if (!formElementHasFocus()) {
      this.isShowingKeyboardShortcuts = !this.isShowingKeyboardShortcuts;
    }
  }

  @onKey('Escape', { event: 'keyup' })
  hideKeyboardShortcuts() {
    if (!formElementHasFocus() && this.isShowingKeyboardShortcuts) {
      this.isShowingKeyboardShortcuts = false;
    }
  }

  @action
  toggleKeyboardShortcuts() {
    this.isShowingKeyboardShortcuts = !this.isShowingKeyboardShortcuts;
  }
}
