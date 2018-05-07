import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    {{#each-in sections as |section items|}}
      {{#if items}}
        <section data-test-api-section class="item-section">
          <h2 data-test-section-header={{section}} class="docs-h2">
            {{capitalize section}}
          </h2>

          {{#each items as |item|}}
            {{api/x-section item=item}}
          {{/each}}
        </section>
      {{/if}}
    {{/each-in}}
  `,
});
