import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { keyResponder, onKey } from 'ember-keyboard';
import { classNames } from '@ember-decorators/component';
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
        const { route, model } = this.get('docsRoutes.next');
        this.router.transitionTo(route, model);
      }
    }
  }

  @onKey('KeyK')
  @onKey('ArrowLeft')
  previousPage() {
    if (!formElementHasFocus()) {
      if (this.get('docsRoutes.previous')) {
        const { route, model } = this.get('docsRoutes.previous');
        this.router.transitionTo(route, model);
      }
    }
  }
}
