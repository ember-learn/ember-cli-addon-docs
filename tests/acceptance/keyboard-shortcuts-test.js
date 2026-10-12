import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMockVersions } from '../helpers/mock-versions';
import { click, triggerEvent, visit, waitUntil } from '@ember/test-helpers';

const DIALOG = '[data-test-docs-keyboard-shortcuts-dialog]';

function pressQuestionMark() {
  return triggerEvent(document.body, 'keyup', {
    key: '?',
    code: 'Slash',
    shiftKey: true,
  });
}

module('Acceptance | Keyboard shortcuts dialog', function (hooks) {
  setupApplicationTest(hooks);
  setupMockVersions(hooks);

  test('pressing ? opens the shortcuts as a native modal dialog', async function (assert) {
    await visit('/');
    assert.dom(DIALOG).doesNotExist();

    await pressQuestionMark();

    let dialog = document.querySelector(DIALOG);
    assert.dom(dialog).exists().hasAttribute('open');
    assert.ok(dialog.matches(':modal'), 'the dialog is shown with showModal()');
    assert.strictEqual(
      document.activeElement,
      dialog,
      'focus moves into the dialog',
    );
    assert.dom(dialog).includesText('Keyboard shortcuts');

    await pressQuestionMark();
    assert.dom(DIALOG).doesNotExist('pressing ? again closes it');
  });

  test('it keeps the layout of the previous modal', async function (assert) {
    await visit('/');
    await pressQuestionMark();

    let dialog = document.querySelector(DIALOG);
    let rect = dialog.getBoundingClientRect();

    assert.closeTo(rect.width, 600, 1, 'the dialog is 600px wide');
    assert.closeTo(rect.top, 100, 1, 'the dialog sits 100px from the top');
    assert.closeTo(
      rect.left + rect.width / 2,
      window.innerWidth / 2,
      1,
      'the dialog is horizontally centered',
    );
    assert.strictEqual(
      getComputedStyle(dialog, '::backdrop').backgroundColor,
      'rgba(27, 31, 35, 0.5)',
      'the backdrop is the same translucent overlay as before',
    );
    assert.strictEqual(
      getComputedStyle(document.body).overflow,
      'hidden',
      'the page behind the dialog does not scroll',
    );
  });

  test('the close button closes it', async function (assert) {
    await visit('/');
    await pressQuestionMark();
    assert.dom(DIALOG).exists();

    await click('[data-test-docs-keyboard-shortcuts-close]');
    assert.dom(DIALOG).doesNotExist();
  });

  test('clicking the backdrop closes it', async function (assert) {
    await visit('/');
    await pressQuestionMark();
    assert.dom(DIALOG).exists();

    // A click whose target is the <dialog> itself lands on its ::backdrop
    await click(DIALOG);
    assert.dom(DIALOG).doesNotExist();
  });

  test('clicking inside the dialog keeps it open', async function (assert) {
    await visit('/');
    await pressQuestionMark();

    await click(`${DIALOG} .docs-fullscreen-modal__body`);
    assert.dom(DIALOG).exists();
  });

  test('Escape closes it', async function (assert) {
    await visit('/');
    await pressQuestionMark();
    assert.dom(DIALOG).exists();

    await triggerEvent(document.body, 'keyup', {
      key: 'Escape',
      code: 'Escape',
    });
    assert.dom(DIALOG).doesNotExist();
  });

  test('closing the dialog natively keeps the component state in sync', async function (assert) {
    await visit('/');
    await pressQuestionMark();

    // This is what the browser does itself on Escape or a light-dismiss click.
    // The `close` event is dispatched asynchronously, so wait for it.
    document.querySelector(DIALOG).close();
    await waitUntil(() => !document.querySelector(DIALOG));

    assert.dom(DIALOG).doesNotExist();

    await pressQuestionMark();
    assert.dom(DIALOG).exists('it can be reopened afterwards');
  });
});
