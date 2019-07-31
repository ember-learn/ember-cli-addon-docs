import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { formElementHasFocus } from '../../keyboard-config';

/**
  The main docs viewer component for EmberCLI AddonDocs. This component must be placed


  ```hbs
  {{#docs-viewer as |viewer|}}
    {{#viewer.nav as |nav|}}
      {{nav.item 'Introduction' 'docs.index'}}

      {{#nav.subnav as |nav|}}
        {{nav.item 'Subitem' 'docs.items.subitem'}}
      {{/nav.subnav}}
    {{/viewer.nav}}

    {{#viewer.main}}
      {{outlet}}
    {{/viewer.main}}
  {{/docs-viewer}}
  ```

  @class DocsViewer
  @yield {Hash} viewer
  @yield {Component} viewer.nav
  @yield {Component} viewer.main
  @public
*/

export default Component.extend(EKMixin, {
  layout,
  docsRoutes: service(),
  router: service(),

  classNames: 'docs-viewer docs-flex docs-flex-1',

  keyboardActivated: true,

  willDestroyElement() {
    this._super(...arguments);

    this.get('docsRoutes').resetState();
  },

  nextPage: on(keyDown('KeyJ'), keyDown('ArrowRight'), function() {
    if (!formElementHasFocus()) {
      if (this.get('docsRoutes.next')) {
        this.get('router').transitionTo(...this.get('docsRoutes.next.route'));
      }
    }
  }),

  previousPage: on(keyDown('KeyK'), keyDown('ArrowLeft'), function() {
    if (!formElementHasFocus()) {
      if (this.get('docsRoutes.previous')) {
        this.get('router').transitionTo(...this.get('docsRoutes.previous.route'));
      }
    }
  }),

});
