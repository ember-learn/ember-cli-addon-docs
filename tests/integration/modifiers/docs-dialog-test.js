import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | docs-dialog', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('onClose', () => {});
    this.set('isOpen', true);
  });

  test('it opens the dialog as a modal and focuses it', async function (assert) {
    await render(hbs`
      {{#if this.isOpen}}
        <dialog tabindex="-1" data-dialog {{docs-dialog onClose=this.onClose}}>
          <button type="button" data-inside>Inside</button>
        </dialog>
      {{/if}}
    `);

    let dialog = document.querySelector('[data-dialog]');
    assert.true(dialog.open, 'the dialog is open');
    assert.ok(dialog.matches(':modal'), 'the dialog is modal');
    assert.strictEqual(document.activeElement, dialog, 'the dialog has focus');

    this.set('isOpen', false);
    assert.dom('[data-dialog]').doesNotExist();
  });

  test('it calls onClose when the dialog closes natively', async function (assert) {
    let closes = 0;
    this.set('onClose', () => closes++);

    await render(hbs`
      <dialog tabindex="-1" data-dialog {{docs-dialog onClose=this.onClose}}>
        <button type="button" data-inside>Inside</button>
      </dialog>
    `);

    document.querySelector('[data-dialog]').close();
    await waitUntil(() => closes === 1);
    assert.strictEqual(closes, 1, 'onClose was called once');
  });

  test('it calls onClose for a backdrop click but not for a click inside', async function (assert) {
    let closes = 0;
    this.set('onClose', () => closes++);

    await render(hbs`
      <dialog tabindex="-1" data-dialog {{docs-dialog onClose=this.onClose}}>
        <button type="button" data-inside>Inside</button>
      </dialog>
    `);

    await click('[data-inside]');
    assert.strictEqual(closes, 0, 'a click inside does not close');

    // A click dispatched on the <dialog> element itself is what a backdrop
    // click looks like: the target is the dialog, not one of its children.
    await click('[data-dialog]');
    assert.strictEqual(closes, 1, 'a backdrop click closes');
  });

  test('it swaps the onClose callback without reopening the dialog', async function (assert) {
    let firstCloses = 0;
    let secondCloses = 0;
    this.set('onClose', () => firstCloses++);

    await render(hbs`
      <dialog tabindex="-1" data-dialog {{docs-dialog onClose=this.onClose}}>
        <button type="button" data-inside>Inside</button>
      </dialog>
    `);

    let dialog = document.querySelector('[data-dialog]');
    let showModalCalls = 0;
    let originalShowModal = dialog.showModal;
    dialog.showModal = function () {
      showModalCalls++;
      return originalShowModal.call(this);
    };

    this.set('onClose', () => secondCloses++);
    await settled();
    await click('[data-dialog]');

    assert.strictEqual(showModalCalls, 0, 'showModal was not called again');
    assert.true(dialog.open, 'the dialog stayed open');
    assert.strictEqual(firstCloses, 0, 'the old callback was detached');
    assert.strictEqual(secondCloses, 1, 'the new callback is used');
  });
});
