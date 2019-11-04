import { module, test } from 'qunit';
import { visit, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

const snippetIds = ['your-snippet-name.hbs', 'your-angle-bracket-snippet-name.hbs'];

module('Acceptance | snippets', function(hooks) {
  setupApplicationTest(hooks);

  test('snippets support both classic & angle bracket invocation', async function(assert) {
    assert.expect(13);

    await visit('/snippets');

    snippetIds.forEach(id => {
      let snippet = `[data-test-id="${id}"]`;

      assert.dom(`${snippet} pre`).includesText('<div id=\'foo\'>');
      assert.dom(`${snippet} button`).hasAttribute('data-clipboard-text', /.*<div id='foo'>.*/);
    });

    let demo = '[data-test-id="your-angle-bracket-snippet-name.hbs"] ~ *:not([data-test-id])';
    let secondDemo = `${demo}:last-child`;

    assert.dom(`${demo} input`).exists({ count: 2 });

    await fillIn(`${demo} input`, '2');
    await fillIn(`${secondDemo} input`, '2');

    assert.dom(demo).includesText('The value is: 2');
    assert.dom(`${demo} input`).hasClass('docs-border');
    assert.dom(`${demo} pre`).includesText('{{input value=this.val class=\'docs-border\'}}');
    assert.dom(`${demo} button`).hasAttribute('data-clipboard-text', /{{input value=this\.val class='docs-border'}}/);

    assert.dom(`${secondDemo}`).includesText('The value is: 2');
    assert.dom(`${secondDemo} input`).hasClass('docs-border');
    assert.dom(`${secondDemo} pre`).includesText('<Input @value={{this.otherVal}} class=\'docs-border\' />');
    assert.dom(`${secondDemo} button`).hasAttribute('data-clipboard-text', /<Input @value={{this\.otherVal}} class='docs-border' \/>/);
  });
});
