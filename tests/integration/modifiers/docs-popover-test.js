import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, triggerEvent } from '@ember/test-helpers';
import { supportsAnchorPositioning } from 'ember-cli-addon-docs/-private/popover';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | docs-popover', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('onClose', () => {});
    this.set('isOpen', true);
  });

  test('it shows the element as a popover while rendered', async function (assert) {
    await render(hbs`
      <button type="button" data-anchor>Anchor</button>
      {{#if this.isOpen}}
        <ul
          popover="manual"
          class="docs-popover"
          data-popover
          {{docs-popover anchor="[data-anchor]" onClose=this.onClose}}
        >
          <li>Item</li>
        </ul>
      {{/if}}
    `);

    assert.dom('[data-popover]').isVisible();
    assert.ok(
      document.querySelector('[data-popover]').matches(':popover-open'),
      'the element is open as a popover',
    );
    assert.strictEqual(
      document.querySelector('[data-popover]').dataset.docsPlacement,
      'bottom-start',
      'placement defaults to bottom-start',
    );

    this.set('isOpen', false);
    assert.dom('[data-popover]').doesNotExist();
  });

  test('it calls onClose on outside pointerdown and Escape, but not on the anchor or trigger', async function (assert) {
    let closes = 0;
    this.set('onClose', () => closes++);

    await render(hbs`
      <button type="button" data-anchor>Anchor</button>
      <button type="button" data-trigger>Trigger</button>
      <button type="button" data-outside>Outside</button>
      <ul
        popover="manual"
        class="docs-popover"
        data-popover
        {{docs-popover
          anchor="[data-anchor]"
          trigger="[data-trigger]"
          placement="bottom-end"
          onClose=this.onClose
        }}
      >
        <li data-inside>Item</li>
      </ul>
    `);

    assert.strictEqual(
      document.querySelector('[data-popover]').dataset.docsPlacement,
      'bottom-end',
    );

    await triggerEvent('[data-inside]', 'pointerdown');
    await triggerEvent('[data-anchor]', 'pointerdown');
    await triggerEvent('[data-trigger]', 'pointerdown');
    assert.strictEqual(closes, 0, 'inside, anchor and trigger do not close');

    await triggerEvent('[data-outside]', 'pointerdown');
    assert.strictEqual(closes, 1, 'outside pointerdown closes');

    await triggerEvent(document.body, 'keydown', { key: 'Escape' });
    assert.strictEqual(closes, 2, 'Escape closes');
  });

  test('it re-runs with the new callback when onClose changes', async function (assert) {
    let firstCloses = 0;
    let secondCloses = 0;
    this.set('onClose', () => firstCloses++);

    await render(hbs`
      <button type="button" data-anchor>Anchor</button>
      <ul
        popover="manual"
        class="docs-popover"
        data-popover
        {{docs-popover anchor="[data-anchor]" onClose=this.onClose}}
      >
        <li>Item</li>
      </ul>
    `);

    this.set('onClose', () => secondCloses++);
    await triggerEvent(document.body, 'pointerdown');

    assert.strictEqual(firstCloses, 0, 'the old listener was torn down');
    assert.strictEqual(secondCloses, 1, 'the new callback is used');
    assert.ok(
      document.querySelector('[data-popover]').matches(':popover-open'),
      'the popover stays open across the re-run',
    );
  });

  test('it tears down listeners and anchor styles when the element is destroyed', async function (assert) {
    let closes = 0;
    this.set('onClose', () => closes++);

    await render(hbs`
      <button type="button" data-anchor>Anchor</button>
      {{#if this.isOpen}}
        <ul
          popover="manual"
          class="docs-popover"
          data-popover
          {{docs-popover anchor="[data-anchor]" onClose=this.onClose}}
        >
          <li>Item</li>
        </ul>
      {{/if}}
    `);

    let anchor = document.querySelector('[data-anchor]');
    assert.ok(
      !supportsAnchorPositioning() || anchor.style.anchorName,
      'the anchor is named while the popover is open',
    );

    this.set('isOpen', false);
    await settled();

    await triggerEvent(document.body, 'pointerdown');
    await triggerEvent(document.body, 'keydown', { key: 'Escape' });
    assert.strictEqual(closes, 0, 'the document listeners were removed');
    assert.notOk(
      anchor.style.anchorName,
      'the anchor name assigned to the anchor was cleared',
    );
  });
});
