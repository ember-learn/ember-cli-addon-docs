import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';

export default Component.extend(EKMixin, {
  layout,
  docsRoutes: service(),
  router: service(),

  classNames: 'docs-viewer',

  init() {
    this._super();

    this.set('keyboardActivated', true);
  },

  didInsertElement() {
    $('body').addClass('docs-viewer--showing');
  },

  willDestroyElement() {
    $('body').removeClass('docs-viewer--showing');
    this.get('docsRoutes').resetState();
  },

  nextPage: on(keyDown('KeyJ'), keyDown('ArrowRight'), function() {
    if (this.searchIsNotFocused() && this.get('docsRoutes.nextRoute')) {
      this.get('router').transitionTo(...this.get('docsRoutes.nextRoute'));
    }
  }),

  previousPage: on(keyDown('KeyK'), keyDown('ArrowLeft'), function() {
    if (this.searchIsNotFocused() && this.get('docsRoutes.previousRoute')) {
      this.get('router').transitionTo(...this.get('docsRoutes.previousRoute'));
    }
  }),

  searchIsNotFocused() {
    return !this.$('.docs-viewer-search__input').is(':focus');
  }

});
