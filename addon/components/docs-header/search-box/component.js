import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';

export default Component.extend(EKMixin, {
  layout,
  classNames: 'ad-ml-auto',

  query: null,

  didInsertElement() {
    this._super();

    this.set('keyboardActivated', true);
  },

  focusSearch: on(keyUp('Slash'), function() {
    this.element.querySelector('input').focus();
  }),

  unfocusSearch: on(keyUp('Escape'), function() {
    this.get('on-input')(null);
  })
});
