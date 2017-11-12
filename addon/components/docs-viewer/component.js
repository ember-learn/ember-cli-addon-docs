import Ember from 'ember';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyDown } from 'ember-keyboard';

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

  nextPage: Ember.on(keyDown('KeyL'), keyDown('ArrowRight'), function() {
    if (this.searchIsNotFocused() && this.get('docsRoutes.nextRoute')) {
      this.get('router').transitionTo(...this.get('docsRoutes.nextRoute'));
    }
  }),

  previousPage: Ember.on(keyDown('KeyH'), keyDown('ArrowLeft'), function() {
    if (this.searchIsNotFocused() && this.get('docsRoutes.previousRoute')) {
      this.get('router').transitionTo(...this.get('docsRoutes.previousRoute'));
    }
  }),

  pageDown: Ember.on(keyDown('KeyJ'), function() {
    if (this.searchIsNotFocused()) {
      let $el = $("#docs-viewer__scroll-body");

      $el.velocity('stop');
      $el.velocity('scroll', {
        offset: ($el.height() - 150),
        container: $el,
        duration: 225
      });
    }
  }),

  halfPageDown: Ember.on(keyDown('ctrl+KeyJ'), function() {
    if (this.searchIsNotFocused()) {
      let $el = $("#docs-viewer__scroll-body");

      $el.velocity('stop');
      $el.velocity('scroll', {
        offset: (($el.height() / 2) - 150),
        container: $el,
        duration: 225
      });
    }
  }),

  pageUp: Ember.on(keyDown('KeyK'), function() {
    if (this.searchIsNotFocused()) {
      let $el = $("#docs-viewer__scroll-body");

      $el.velocity('stop');
      $el.velocity('scroll', {
        offset: -($el.height() - 150),
        container: $el,
        duration: 225
      });
    }
  }),

  halfPageUp: Ember.on(keyDown('ctrl+KeyK'), function() {
    if (this.searchIsNotFocused()) {
      let $el = $("#docs-viewer__scroll-body");

      $el.velocity('stop');
      $el.velocity('scroll', {
        offset: -(($el.height() / 2) - 150),
        container: $el,
        duration: 225
      });
    }
  }),

  searchIsNotFocused() {
    return !this.$('.docs-viewer-search__input').is(':focus');
  }

});
