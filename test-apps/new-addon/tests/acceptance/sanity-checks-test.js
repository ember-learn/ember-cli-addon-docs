import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sanity checks test', function(hooks) {
  setupApplicationTest(hooks);

  test('the dummy app boots', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('the --brand-primary css variable works', async function(assert) {
    await visit('/');

    assert.dom(`.docs-bg-brand`).hasStyle({
      backgroundColor: 'rgb(0, 128, 0)'
    });
  });

  test('the compileMarkdown function works', async function(assert) {
    await visit('/route-using-compile-markdown');

    assert.dom(`.docs-md`).includesText('In the beginning');
    assert.dom(`pre`).hasStyle({
      backgroundColor: 'rgb(40, 44, 52)'
    });
  });
});
