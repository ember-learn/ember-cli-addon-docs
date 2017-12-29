import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Docs route test');

test('the docs route renders', function(assert) {
  visit('/docs');

  andThen(function() {
    assert.equal(currentURL(), '/docs');
  });
});
