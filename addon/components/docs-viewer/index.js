import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { keyResponder, onKey } from 'ember-keyboard';
import { formElementHasFocus } from '../../keyboard-config';

/**
  The main docs viewer component for EmberCLI AddonDocs. This component must be placed


  ```hbs
  <DocsViewer as |viewer|>
    <viewer.nav as |nav|>
      <nav.item @label="Introduction" @route="docs.index"/>

      <nav.subnav as |nav|>
        <nav.item @label="Subitem" @route="docs.items.subitem"/>
      </nav.subnav>
    </viewer.nav>

    <viewer.main>
      {{outlet}}
    </viewer.main>
  </DocsViewer>
  ```

  @class DocsViewer
  @yield {Hash} viewer
  @yield {Component} viewer.nav
  @yield {Component} viewer.main
  @public
*/
@keyResponder
export default class DocsViewerComponent extends Component {
  @service docsRoutes;
  @service router;

  @tracked pageIndex;

  constructor() {
    super(...arguments);

    // for some reason the glimmer willDestroy hook was not
    // being ran when switching to the sandbox app but the contructor was.
    // If we're rendering a new docs-viewer, it's safe to assume we want
    // to reset the doc routes
    this.docsRoutes.resetState();
  }

  @onKey('KeyJ')
  @onKey('ArrowRight')
  nextPage() {
    if (!formElementHasFocus()) {
      if (this.docsRoutes.next) {
        const { route, model } = this.docsRoutes.next;
        this.router.transitionTo(route, model);
      }
    }
  }

  @onKey('KeyK')
  @onKey('ArrowLeft')
  previousPage() {
    if (!formElementHasFocus()) {
      if (this.docsRoutes.previous) {
        const { route, model } = this.docsRoutes.previous;
        this.router.transitionTo(route, model);
      }
    }
  }
}
