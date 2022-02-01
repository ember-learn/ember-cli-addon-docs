import { module, test } from 'qunit';
import { visit, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

const snippetIds = [
  'your-snippet-name.hbs',
  'your-angle-bracket-snippet-name.hbs',
  'standalone-curlies',
  'standalone-angle-brackets'
];

module('Acceptance | snippets', function(hooks) {
  setupApplicationTest(hooks);

  test('snippets support angle bracket invocation', async function(assert) {
    assert.expect(12);

    await visit('/snippets');

    snippetIds.forEach(id => {
      let snippet = `[data-test-id="${id}"]`;

      assert.dom(`${snippet} pre`).includesText('<div id="foo">');
      assert.dom(`${snippet} button`).hasAttribute('data-clipboard-text', /.*<div id="foo">.*/);
    });

    let demo = '[data-test-id="your-angle-bracket-snippet-name.hbs"] ~ *:not([data-test-id])';
    let secondDemo = `${demo}:last-child`;

    await fillIn(`${secondDemo} input`, '2');

    assert.dom(`${secondDemo}`).includesText('The value is: 2');
    assert.dom(`${secondDemo} input`).hasClass('docs-border');
    assert.dom(`${secondDemo} pre`).includesText('<Input @value={{this.otherVal}} class="docs-border" />');
    assert.dom(`${secondDemo} button`).hasAttribute('data-clipboard-text', /<Input @value={{this\.otherVal}} class="docs-border" \/>/);
  });
});
