import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile'

export default Component.extend({
  tagName: 'ul',

  classNames: ['docs-list-reset'],

  layout: hbs`
    {{yield (hash
      item=(component 'docs-viewer/x-nav-item')
    )}}
  `
});
