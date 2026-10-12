import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMockVersions } from '../helpers/mock-versions';
import {
  click,
  currentURL,
  fillIn,
  triggerEvent,
  visit,
  waitFor,
} from '@ember/test-helpers';

const INPUT = '[data-test-search-box-input]';
const POPOVER = '[data-test-docs-search-results]';
const RESULTS = '[data-test-search-result-list]';

module('Acceptance | Search', function (hooks) {
  setupApplicationTest(hooks);
  setupMockVersions(hooks);

  test('search works for guides pages', async function (assert) {
    await visit('/');
    await fillIn('[data-test-search-box-input]', 'quickstart');

    await waitFor('[data-test-search-result]', { timeout: 2000 });

    await click('[data-test-search-result] a');
    assert.strictEqual(currentURL(), '/docs/quickstart');
  });

  test('search works for API pages', async function (assert) {
    await visit('/');
    await fillIn('[data-test-search-box-input]', 'hero');

    await waitFor('[data-test-search-result]', { timeout: 2000 });

    await click('[data-test-search-result] a');
    assert.strictEqual(currentURL(), '/docs/api/components/docs-hero');
  });

  module('results popover', function (hooks) {
    hooks.beforeEach(async function () {
      await visit('/');
      await fillIn(INPUT, 'quickstart');
      await waitFor('[data-test-search-result]', { timeout: 2000 });
    });

    test('it renders in the top layer, aligned under the search box', async function (assert) {
      let list = document.querySelector(RESULTS);
      assert.ok(
        document.querySelector(POPOVER).matches(':popover-open'),
        'the results are shown in an open popover',
      );

      let listRect = list.getBoundingClientRect();
      let boxRect = document
        .querySelector('[data-search-box]')
        .getBoundingClientRect();

      // Left edges line up, unless that would push the list past the right
      // edge of the viewport, in which case it hugs the viewport edge instead
      let expectedLeft = Math.min(
        boxRect.left,
        window.innerWidth - listRect.width,
      );
      assert.closeTo(listRect.left, expectedLeft, 1, 'left edges line up');
      assert.closeTo(
        listRect.top,
        boxRect.bottom,
        1,
        'the list starts right below the search box',
      );
      assert.closeTo(listRect.width, 304, 1, 'the list keeps its 19rem width');
      assert.ok(
        listRect.right <= window.innerWidth,
        'the list stays inside the viewport',
      );
    });

    test('clicking outside closes the results and clears the query', async function (assert) {
      await triggerEvent(document.body, 'pointerdown');

      assert.dom(RESULTS).doesNotExist();
      assert.dom(INPUT).hasValue('');
    });

    test('clicking the search box keeps the results open', async function (assert) {
      await triggerEvent(INPUT, 'pointerdown');
      await click(INPUT);

      assert.dom(RESULTS).exists();
      assert.dom(INPUT).hasValue('quickstart');
    });

    test('clicking a result keeps it open until navigation', async function (assert) {
      await triggerEvent('[data-test-search-result]', 'pointerdown');
      assert.dom(RESULTS).exists();
    });

    test('Escape closes the results', async function (assert) {
      await triggerEvent(document.body, 'keydown', {
        key: 'Escape',
        code: 'Escape',
      });

      assert.dom(RESULTS).doesNotExist();
    });
  });
});
