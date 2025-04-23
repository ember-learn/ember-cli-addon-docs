import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { capitalize } from '@ember/string';

module('Integration | Helper | capitalize', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const testString = 'abc 123 ABC !@# Foo Bar';
    this.set('inputValue', testString);

    await render(hbs`{{capitalize this.inputValue}}`);

    assert.dom().hasText(capitalize(testString));
  });
});
