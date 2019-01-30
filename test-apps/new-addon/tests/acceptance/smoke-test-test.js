import { module, test } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | boot test', function(hooks) {
  setupApplicationTest(hooks);

  test('the dummy app boots', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('the --brand-primary css variable works', async function(assert) {
    await visit('/');

    let hero = find('.docs-bg-brand');
    let fontSize = window.getComputedStyle(hero).getPropertyValue("background-color");

    assert.equal(fontSize, 'rgb(0, 128, 0)');
  });
});
