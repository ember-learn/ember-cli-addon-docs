import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    {{#each-in sections as |sectionName items|}}
      {{#if items}}
        <section data-test-api-section class="item-section">
          <h2 data-test-section-header={{sectionName}} class="docs-h2">
            {{capitalize sectionName}}
          </h2>

          {{#each items as |item|}}
            {{api/x-section item=item}}
          {{/each}}
        </section>
      {{/if}}
    {{/each-in}}
  `,
});
