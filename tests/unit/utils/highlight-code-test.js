import { highlightCode } from 'ember-cli-addon-docs/utils/compile-markdown';
import { module, test } from 'qunit';

module('Unit | Utility | highlight-code', function(hooks) {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = highlightCode(`let foo = 'bar';`, 'js');
    assert.equal(result, `<span class="hljs-keyword">let</span> foo = <span class="hljs-string">'bar'</span>;`);
  });
});
