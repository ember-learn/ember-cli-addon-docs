import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import {
  click,
  currentURL,
  fillIn,
  find,
  findAll,
  visit,
  waitUntil,
} from '@ember/test-helpers';

module('Acceptance | Search', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('search works for guides pages', async function (assert) {
    await visit('/');
    await fillIn('[data-test-search-box-input]', 'quickstart');

    await waitUntil(
      function () {
        return findAll('[data-test-search-result]').length > 0;
      },
      { timeout: 2000 }
    );

    await click(find('[data-test-search-result] a'));
    assert.equal(currentURL(), '/docs/quickstart');
  });

  test('search works for API pages', async function (assert) {
    await visit('/');
    await fillIn('[data-test-search-box-input]', 'hero');

    await waitUntil(
      function () {
        return findAll('[data-test-search-result]').length > 0;
      },
      { timeout: 2000 }
    );

    await click(find('[data-test-search-result] a'));
    assert.equal(currentURL(), '/docs/api/components/docs-hero');
  });
});
