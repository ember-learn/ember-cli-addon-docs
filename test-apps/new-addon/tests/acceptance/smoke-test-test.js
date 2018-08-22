import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | boot test', function(hooks) {
  setupApplicationTest(hooks);

  test('the dummy app boots', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });
});
