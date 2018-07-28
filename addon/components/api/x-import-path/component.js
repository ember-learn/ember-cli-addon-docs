import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="import-path ad-mb-6 ad-font-mono" data-test-import-path>
      <span class="hljs-keyword">import</span>

      {{#if (eq item.exportType "default")}}
        {{item.name}}
      {{else}}
      { {{item.name}} }
      {{/if}}

      <span class="hljs-keyword">from</span>
      <span class="hljs-string">'{{item.file}}'</span>;
    </div>
  `,
});
