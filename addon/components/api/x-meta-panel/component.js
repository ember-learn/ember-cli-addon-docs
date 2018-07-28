import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="ad-px-6 ad-pt-3 ad-mt-4 ad-border ad-border-grey-light ad-rounded ad-text-sm">
      {{yield (hash
        header=(component 'api/x-meta-panel/header')
      )}}
    </div>
  `,
});
