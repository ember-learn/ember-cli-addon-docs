import { inject as service } from '@ember/service';
import Component from '@ember/component';
import template from './template';
import { keyResponder, onKey } from 'ember-keyboard';
import { classNames, layout } from '@ember-decorators/component';
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

@classNames('docs-viewer docs-flex docs-flex-1')
@layout(template)
@keyResponder
export default class DocsViewerComponent extends Component {
  @service docsRoutes;
  @service router;

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this.docsRoutes.resetState();
  }

  @onKey('KeyJ')
  @onKey('ArrowRight')
  nextPage() {
    if (!formElementHasFocus()) {
      if (this.get('docsRoutes.next')) {
        this.router.transitionTo(...this.get('docsRoutes.next.route'));
      }
    }
  }

  @onKey('KeyK')
  @onKey('ArrowLeft')
  previousPage() {
    if (!formElementHasFocus()) {
      if (this.get('docsRoutes.previous')) {
        this.router.transitionTo(...this.get('docsRoutes.previous.route'));
      }
    }
  }
}
