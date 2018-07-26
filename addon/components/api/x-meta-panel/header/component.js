import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <h4 class="ad-mb-2 ad-text-grey ad-font-bold ad-tracking-wide ad-uppercase ad-text-xs">
      {{yield}}
    </h4>
  `,
});
