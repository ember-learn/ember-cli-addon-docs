import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit, waitUntil } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';

module('Acceptance | API | components', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('nested components work', async function(assert) {
    await visit('/sandbox');
    await modulePage.navItems.findOne({ text: '{{simple-list}}' }).click();

    assert.equal(currentURL(), '/sandbox/api/components/simple-list', 'correct url');

    await modulePage.navItems.findOne({ text: '{{simple-list/\u200Bitem}}' }).click();

    assert.equal(currentURL(), '/sandbox/api/components/simple-list/item', 'correct url');
  });

  test('component page index works', async function(assert) {
    await visit('/sandbox');
    await modulePage.navItems.findOne({ text: '{{esdoc-component}}' }).click();

    assert.equal(currentURL(), '/sandbox/api/components/esdoc-component', 'correct url');

    let indexItems = modulePage.index.items.map(i => i.text);

    assert.equal(indexItems.length, 7, 'correct number of items rendered');
    assert.ok(indexItems.includes('Yields') && indexItems.includes('Arguments'), 'correct sections rendered');

    await modulePage.toggles.findOne({ text: 'Internal' }).click();
    await waitUntil(() => modulePage.index.items.length === 12);

    indexItems = modulePage.index.items.map(i => i.text);

    assert.ok(indexItems.includes('Fields') && indexItems.includes('Methods'), 'correct sections rendered');

    await modulePage.toggles.findOne({ text: 'Private' }).click();
    await waitUntil(() => modulePage.index.items.length === 13);

    indexItems = modulePage.index.items.map(i => i.text);

    assert.equal(indexItems.length, 13, 'correct number of items rendered');
    assert.ok(indexItems.includes('_privateField'), 'private field rendered');
  });

  test('search box works', async function(assert) {
    await visit('/sandbox');

    assert.equal(modulePage.searchResults.items.length, 0, 'no search results shown');
    await modulePage.fillInSearchQuery('sub-subsection');
    await waitUntil(() => modulePage.searchResults.items.length > 0);
    assert.equal(modulePage.searchResults.items.length, 1, 'one search result shown');
  });
});
