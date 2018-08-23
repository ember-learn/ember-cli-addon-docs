import { module, test } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | boot test', function(hooks) {
  setupApplicationTest(hooks);

  test('the dummy app boots', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('styles are properly loaded', async function(assert) {
    await visit('/');

    let title = find('h1');
    let fontSize = window.getComputedStyle(title).getPropertyValue("font-size");

    assert.equal(fontSize, '60px');
  });
});
