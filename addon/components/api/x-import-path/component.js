import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="import-path docs-mb-6" data-test-import-path>
      <pre class="docs-md__code docs-whitespace-no-wrap">
        <span class="hljs-keyword">import</span>

        {{#if (eq item.exportType "default")}}
          {{item.name}}
        {{else}}
        { {{item.name}} }
        {{/if}}

        <span class="hljs-keyword">from</span>
        <span class="hljs-string">'{{item.file}}'</span>;
      </pre>
    </div>
  `,
});
