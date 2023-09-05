import {
  highlightCode,
  default as compileMarkdown,
} from 'ember-cli-addon-docs/utils/compile-markdown';
import { module, test } from 'qunit';

module('Unit | Utility | compile-markdown', function (hooks) {
  test('should be able to highlight javascript', function (assert) {
    let result = highlightCode(`let foo = 'bar';`, 'javascript');
    assert.strictEqual(
      result,
      `<span class="hljs-keyword">let</span> foo = <span class="hljs-string">&#x27;bar&#x27;</span>;`,
    );
  });

  test('should render a table', function (assert) {
    let result = compileMarkdown(
      `
| Dependency Name | Engine A | Host |
|-----------------|----------|------|
| Foo             | v2       | v1   |
    `.trim(),
    );
    assert.strictEqual(
      result,
      `<div class="docs-md"><table class="docs-table-auto">
<thead>
<tr class="docs-table-row">
<th class="docs-border docs-px-4 docs-py-2">Dependency Name</th>
<th class="docs-border docs-px-4 docs-py-2">Engine A</th>
<th class="docs-border docs-px-4 docs-py-2">Host</th>
</tr>
</thead>
<tbody><tr class="docs-table-row">
<td class="docs-border docs-px-4 docs-py-2">Foo</td>
<td class="docs-border docs-px-4 docs-py-2">v2</td>
<td class="docs-border docs-px-4 docs-py-2">v1</td>
</tr>
</tbody></table>
</div>`,
    );
  });
});
