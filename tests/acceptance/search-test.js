import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { click, currentURL, fillIn, visit, waitFor } from '@ember/test-helpers';

module('Acceptance | Search', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

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
});
