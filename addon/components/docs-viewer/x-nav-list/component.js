import Component from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

export default Component.extend({
  tagName: 'ul',

  layout: hbs`
    {{yield (hash
      item=(component 'docs-viewer/x-nav-item')
    )}}
  `
});
