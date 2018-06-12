import Controller from '@ember/controller';
import { EKMixin, keyUp } from 'ember-keyboard';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { later } from '@ember/runloop';
import { formElementHasFocus } from '../keyboard-config';

export default Controller.extend(EKMixin, {

  router: service(),

  isShowingKeyboardShortcuts: false,

  activateKeyboard: on('init', function() {
    this.set('keyboardActivated', true);
  }),

  goto: on(keyUp('KeyG'), function() {
    if (!formElementHasFocus()) {
      this.set('isGoingTo', true);
      later(() => {
        this.set('isGoingTo', false);
      }, 500);
    }
  }),

  gotoDocs: on(keyUp('KeyD'), function() {
    if (!formElementHasFocus()) {
      if (this.get('isGoingTo')) {
        this.get('router').transitionTo('docs');
      }
    }
  }),

  gotoHome: on(keyUp('KeyH'), function() {
    if (!formElementHasFocus()) {
      if (this.get('isGoingTo')) {
        this.get('router').transitionTo('index');
      }
    }
  }),

  toggleKeyboardShortcuts: on(keyUp('shift+Slash'), function() {
    if (!formElementHasFocus()) {
      this.toggleProperty('isShowingKeyboardShortcuts');
    }
  }),

  actions: {
    toggleKeyboardShortcuts() {
      this.toggleProperty('isShowingKeyboardShortcuts');
    }
  }
});
