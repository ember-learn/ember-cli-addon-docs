import { module, test } from 'qunit';
import { visit, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

const snippetIds = [
  'your-angle-bracket-snippet-name.hbs',
  'standalone-angle-brackets'
];

module('Acceptance | snippets', function(hooks) {
  setupApplicationTest(hooks);

  test('snippets support both classic & angle bracket invocation', async function(assert) {
    assert.expect(9);

    await visit('/snippets');

    snippetIds.forEach(id => {
      let snippet = `[data-test-id="${id}"]`;

      assert.dom(`${snippet} pre`).includesText('<div id="foo">');
      assert.dom(`${snippet} button`).hasAttribute('data-clipboard-text', /.*<div id="foo">.*/);
    });

    let demo = '[data-test-id="docs-demo-angle-brackets"]';

    assert.dom(`${demo} input`).exists();

    await fillIn(`${demo} input`, '2');

    assert.dom(demo).includesText('The value is: 2');
    assert.dom(`${demo} input`).hasClass('docs-border');
    assert.dom(`${demo} pre`).includesText('<Input @value={{this.otherVal}} class="docs-border" />');
    assert.dom(`${demo} button`).hasAttribute('data-clipboard-text', /<Input @value={{this\.otherVal}} class="docs-border" \/>/);
  });
});