import { module, test } from 'qunit';
import Component from 'ember-cli-addon-docs/models/component';

module('Unit | Model | component', function () {
  test('filters arguments by access level', function (assert) {
    let comp = new Component();
    comp.arguments = [
      { name: 'pubArg', access: 'public' },
      { name: 'privArg', access: 'private' },
    ];
    comp.accessors = [];
    comp.methods = [];
    comp.fields = [];

    assert.strictEqual(comp.publicArguments.length, 1);
    assert.strictEqual(comp.privateArguments.length, 1);
  });

  test('allArguments includes parent arguments', function (assert) {
    let parent = new Component();
    parent.arguments = [{ name: 'parentArg', access: 'public' }];
    parent.accessors = [];
    parent.methods = [];
    parent.fields = [];

    let child = new Component();
    child.parentClass = parent;
    child.arguments = [{ name: 'childArg', access: 'public' }];
    child.accessors = [];
    child.methods = [];
    child.fields = [];

    assert.strictEqual(child.allArguments.length, 2);
  });

  test('hasInherited includes parent arguments and yields', function (assert) {
    let parent = new Component();
    parent.arguments = [{ name: 'arg', access: 'public' }];
    parent.accessors = [];
    parent.methods = [];
    parent.fields = [];

    let child = new Component();
    child.parentClass = parent;
    child.arguments = [];
    child.accessors = [];
    child.methods = [];
    child.fields = [];

    assert.true(child.hasInherited);
  });

  test('hasInternal detects internal members', function (assert) {
    let comp = new Component();
    comp.arguments = [];
    comp.accessors = [{ name: 'a', access: 'public' }];
    comp.methods = [];
    comp.fields = [];

    assert.true(comp.hasInternal);
  });

  test('routingId returns dasherized component path', function (assert) {
    let comp = new Component();
    comp.name = 'MyComponent';
    comp.accessors = [];
    comp.methods = [];
    comp.fields = [];
    comp.arguments = [];

    assert.strictEqual(comp.routingId, 'components/my-component');
  });

  test('hasDeprecated checks arguments too', function (assert) {
    let comp = new Component();
    comp.arguments = [
      { name: 'old', access: 'public', tags: [{ name: 'deprecated' }] },
    ];
    comp.accessors = [];
    comp.methods = [];
    comp.fields = [];

    assert.true(comp.hasDeprecated);
  });
});
