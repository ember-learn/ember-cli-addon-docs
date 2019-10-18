import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="docs-px-6 docs-pt-3 docs-mt-4 docs-border docs-border-grey-light docs-rounded docs-text-xs">
      {{yield (hash
        header=(component 'api/x-meta-panel/header')
      )}}
    </div>
  `,
});
