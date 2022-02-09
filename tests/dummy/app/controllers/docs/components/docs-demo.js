// this controller is needed for the Multiple snippets `DocsDemo` demo to work.

// BEGIN-SNIPPET docs-demo-multiple.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DocsDemoController extends Controller {
  @tracked isShowing = false;

  @action
  toggleIsShowing() {
    this.isShowing = !this.isShowing;
  }
}
// END-SNIPPET
