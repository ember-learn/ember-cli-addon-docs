import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <h4 class="docs-mb-2 docs-text-grey docs-font-bold docs-tracking-wide docs-uppercase docs-text-xxs">
      {{yield}}
    </h4>
  `,
});
