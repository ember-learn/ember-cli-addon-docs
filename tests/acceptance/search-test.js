import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit, click, find, waitUntil, currentURL } from '@ember/test-helpers';

import appPage from '../pages/app';

module('Acceptance | Search', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('search works for guides pages', async function (assert) {
    await visit('/');
    await appPage.fillInSearchQuery('quickstart');

    await waitUntil(() => appPage.searchResults.items.length > 0);

    await click(find('[data-test-search-result] a'));
    assert.equal(currentURL(), '/docs/quickstart');
  });

  test('search works for API pages', async function (assert) {
    await visit('/');
    await appPage.fillInSearchQuery('hero');

    await waitUntil(() => appPage.searchResults.items.length > 0);

    await click(find('[data-test-search-result] a'));
    assert.equal(currentURL(), '/docs/api/components/docs-hero');
  });
});
