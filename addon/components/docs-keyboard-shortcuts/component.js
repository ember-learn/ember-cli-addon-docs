import Component from '@ember/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import template from './template';
import { keyResponder, onKey } from 'ember-keyboard';
import { layout } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { formElementHasFocus } from '../../keyboard-config';

/**
  A component that enables keyboard shortcuts. Press '?' to toggle the keyboard shortcuts dialog.

  @class DocsKeyboardShortcuts
  @public
*/

@layout(template)
@keyResponder
export default class DocsKeyboardShortcutsComponent extends Component {
  @service router;

  isShowingKeyboardShortcuts = false;

  @onKey('KeyG', { event: 'keyup' })
  goto() {
    if (!formElementHasFocus()) {
      this.set('isGoingTo', true);
      later(() => {
        this.set('isGoingTo', false);
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
      this.toggleProperty('isShowingKeyboardShortcuts');
    }
  }

  @onKey('Escape', { event: 'keyup' })
  hideKeyboardShortcuts() {
    if (!formElementHasFocus() && this.isShowingKeyboardShortcuts) {
      this.set('isShowingKeyboardShortcuts', false);
    }
  }

  @action
  toggleKeyboardShortcuts() {
    this.toggleProperty('isShowingKeyboardShortcuts');
  }
}
