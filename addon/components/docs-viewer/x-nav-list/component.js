import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',

  classNames: ['docs-list-reset'],

  layout: hbs`
    {{yield (hash
      item=(component 'docs-viewer/x-nav-item')
    )}}
  `
});
