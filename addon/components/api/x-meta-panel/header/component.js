import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <h4 class="mb-2 text-grey font-bold tracking-wide uppercase text-xs">
      {{yield}}
    </h4>
  `,
});
