import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';

module('Acceptance | Sandbox | API | Guides', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('page index works', async function (assert) {
    await visit('/sandbox');
    assert.strictEqual(currentURL(), `/sandbox`, 'correct url');

    let indexItems = modulePage.index.items.map((i) => i.text);

    assert.strictEqual(
      indexItems.length,
      3,
      'correct number of items rendered',
    );
    assert.ok(
      // eslint-disable-next-line qunit/no-assert-logical-expression
      indexItems.includes('Subsection') &&
        indexItems.includes('Sub-subsection'),
      'correct sections rendered',
    );
  });
});
