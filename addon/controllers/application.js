import Ember from 'ember';
import Controller from '@ember/controller';
import { EKMixin, keyUp } from 'ember-keyboard';
import { inject as service } from '@ember/service';

export default Controller.extend(EKMixin, {

  router: service(),

  isShowingKeyboardShortcuts: false,

  activateKeyboard: Ember.on('init', function() {
    this.set('keyboardActivated', true);
  }),

  goto: Ember.on(keyUp('KeyG'), function() {
    this.set('isGoingTo', true);
    Ember.run.later(() => {
      this.set('isGoingTo', false);
    }, 500);
  }),

  gotoDocs: Ember.on(keyUp('KeyD'), function() {
    if (this.get('isGoingTo')) {
      this.get('router').transitionTo('docs');
    }
  }),

  gotoHome: Ember.on(keyUp('KeyH'), function() {
    if (this.get('isGoingTo')) {
      this.get('router').transitionTo('index');
    }
  }),

  toggleKeyboardShortcuts: Ember.on(keyUp('shift+Slash'), function() {
    this.toggleProperty('isShowingKeyboardShortcuts');
  }),

  actions: {
    toggleKeyboardShortcuts() {
      this.toggleProperty('isShowingKeyboardShortcuts');
    }
  }
});
