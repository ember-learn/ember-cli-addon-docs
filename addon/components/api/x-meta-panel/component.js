import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="docs-px-6 docs-pt-3 docs-mt-4 docs-border docs-border-grey-light docs-rounded docs-text-sm">
      {{yield (hash
        header=(component 'api/x-meta-panel/header')
      )}}
    </div>
  `,
});
