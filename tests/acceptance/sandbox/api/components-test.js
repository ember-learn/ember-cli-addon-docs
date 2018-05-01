import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';

module('Acceptance | API | components', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('nested components work', async function(assert) {
    await visit('/sandbox');
    await modulePage.navItems.findOne({ text: `{{simple-list}}` }).click();

    assert.equal(currentURL(), `/sandbox/api/components/simple-list`, 'correct url');

    await modulePage.navItems.findOne({ text: `{{simple-list/item}}` }).click();

    assert.equal(currentURL(), `/sandbox/api/components/simple-list/item`, 'correct url');
  });
});
