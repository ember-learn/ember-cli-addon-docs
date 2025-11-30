import { module, test } from 'qunit';
import {
  capitalize,
  dasherize,
  classify,
} from 'ember-cli-addon-docs/utils/string';

module('Unit | Utility | string', function () {
  module('capitalize', function () {
    test('capitalizes the first letter', function (assert) {
      assert.strictEqual(capitalize('hello'), 'Hello');
      assert.strictEqual(capitalize('world'), 'World');
      assert.strictEqual(capitalize('innerHTML'), 'InnerHTML');
    });

    test('handles already capitalized strings', function (assert) {
      assert.strictEqual(capitalize('Hello'), 'Hello');
    });

    test('handles empty strings', function (assert) {
      assert.strictEqual(capitalize(''), '');
    });

    test('handles non-strings', function (assert) {
      assert.strictEqual(capitalize(null), null);
      assert.strictEqual(capitalize(undefined), undefined);
    });
  });

  module('dasherize', function () {
    test('converts camelCase to kebab-case', function (assert) {
      assert.strictEqual(dasherize('innerHTML'), 'inner-html');
      assert.strictEqual(dasherize('actionName'), 'action-name');
    });

    test('converts spaces to dashes', function (assert) {
      assert.strictEqual(dasherize('my favorite items'), 'my-favorite-items');
    });

    test('converts underscores to dashes', function (assert) {
      assert.strictEqual(dasherize('action_name'), 'action-name');
    });

    test('handles already dasherized strings', function (assert) {
      assert.strictEqual(dasherize('css-class-name'), 'css-class-name');
    });

    test('handles PascalCase', function (assert) {
      assert.strictEqual(dasherize('MyComponent'), 'my-component');
    });

    test('handles non-strings', function (assert) {
      assert.strictEqual(dasherize(null), null);
      assert.strictEqual(dasherize(undefined), undefined);
    });
  });

  module('classify', function () {
    test('converts kebab-case to PascalCase', function (assert) {
      assert.strictEqual(classify('css-class-name'), 'CssClassName');
      assert.strictEqual(classify('ember-cli-addon-docs'), 'EmberCliAddonDocs');
      assert.strictEqual(classify('addon-docs'), 'AddonDocs');
    });

    test('converts snake_case to PascalCase', function (assert) {
      assert.strictEqual(classify('action_name'), 'ActionName');
    });

    test('converts space-separated to PascalCase', function (assert) {
      assert.strictEqual(classify('my favorite items'), 'MyFavoriteItems');
    });

    test('preserves camelCase and capitalizes first letter', function (assert) {
      assert.strictEqual(classify('innerHTML'), 'InnerHTML');
      assert.strictEqual(classify('myComponent'), 'MyComponent');
    });

    test('handles single words', function (assert) {
      assert.strictEqual(classify('component'), 'Component');
      assert.strictEqual(classify('Component'), 'Component');
    });

    test('handles non-strings', function (assert) {
      assert.strictEqual(classify(null), null);
      assert.strictEqual(classify(undefined), undefined);
    });
  });
});
