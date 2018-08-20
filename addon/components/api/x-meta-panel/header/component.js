import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <h4 class="docs-mb-2 docs-text-grey docs-font-bold docs-tracking-wide docs-uppercase docs-text-xs">
      {{yield}}
    </h4>
  `,
});
