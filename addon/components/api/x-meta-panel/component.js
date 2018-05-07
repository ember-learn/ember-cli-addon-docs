import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="px-6 pt-3 mt-4 border border-grey-light rounded text-sm">
      {{yield (hash
        header=(component 'api/x-meta-panel/header')
      )}}
    </div>
  `,
});
