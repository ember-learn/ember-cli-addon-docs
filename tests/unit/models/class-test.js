import { module, test } from 'qunit';
import Class from 'ember-cli-addon-docs/models/class';

module('Unit | Model | class', function () {
  test('filters members by access level', function (assert) {
    let klass = new Class();
    klass.accessors = [
      { name: 'pubAcc', access: 'public' },
      { name: 'privAcc', access: 'private' },
      { name: 'protAcc', access: 'protected' },
    ];
    klass.methods = [{ name: 'pubMethod', access: 'public' }];
    klass.fields = [{ name: 'privField', access: 'private' }];

    assert.strictEqual(klass.publicAccessors.length, 1);
    assert.strictEqual(klass.publicAccessors[0].name, 'pubAcc');
    assert.strictEqual(klass.privateAccessors.length, 1);
    assert.strictEqual(klass.protectedAccessors.length, 1);
    assert.strictEqual(klass.publicMethods.length, 1);
    assert.strictEqual(klass.privateFields.length, 1);
  });

  test('allPublic* includes parent members via memberUnion', function (assert) {
    let parent = new Class();
    parent.accessors = [{ name: 'parentAcc', access: 'public' }];
    parent.methods = [];
    parent.fields = [];

    let child = new Class();
    child.parentClass = parent;
    child.accessors = [{ name: 'childAcc', access: 'public' }];
    child.methods = [];
    child.fields = [];

    assert.strictEqual(child.allPublicAccessors.length, 2);
    let names = child.allPublicAccessors.map((a) => a.name);
    assert.ok(names.includes('parentAcc'));
    assert.ok(names.includes('childAcc'));
  });

  test('child members override parent members with same name', function (assert) {
    let parent = new Class();
    parent.accessors = [
      { name: 'shared', access: 'public', from: 'parent' },
    ];
    parent.methods = [];
    parent.fields = [];

    let child = new Class();
    child.parentClass = parent;
    child.accessors = [
      { name: 'shared', access: 'public', from: 'child' },
    ];
    child.methods = [];
    child.fields = [];

    assert.strictEqual(child.allPublicAccessors.length, 1);
    assert.strictEqual(child.allPublicAccessors[0].from, 'child');
  });

  test('hasInherited is true when parent has members', function (assert) {
    let parent = new Class();
    parent.accessors = [{ name: 'a', access: 'public' }];
    parent.methods = [];
    parent.fields = [];

    let child = new Class();
    child.parentClass = parent;
    child.accessors = [];
    child.methods = [];
    child.fields = [];

    assert.true(child.hasInherited);
  });

  test('hasInherited is false when no parent', function (assert) {
    let klass = new Class();
    klass.accessors = [{ name: 'a', access: 'public' }];
    klass.methods = [];
    klass.fields = [];

    assert.false(klass.hasInherited);
  });

  test('hasPrivate detects private members', function (assert) {
    let klass = new Class();
    klass.accessors = [];
    klass.methods = [{ name: 'm', access: 'private' }];
    klass.fields = [];

    assert.true(klass.hasPrivate);
  });

  test('hasDeprecated detects deprecated members', function (assert) {
    let klass = new Class();
    klass.accessors = [];
    klass.methods = [
      { name: 'old', access: 'public', tags: [{ name: 'deprecated' }] },
    ];
    klass.fields = [];

    assert.true(klass.hasDeprecated);
  });

  test('hasDeprecated is false when no deprecated members', function (assert) {
    let klass = new Class();
    klass.accessors = [];
    klass.methods = [{ name: 'current', access: 'public', tags: [] }];
    klass.fields = [];

    assert.false(klass.hasDeprecated);
  });

  test('allAccessors combines all access levels', function (assert) {
    let klass = new Class();
    klass.accessors = [
      { name: 'pub', access: 'public' },
      { name: 'priv', access: 'private' },
      { name: 'prot', access: 'protected' },
    ];
    klass.methods = [];
    klass.fields = [];

    assert.strictEqual(klass.allAccessors.length, 3);
  });
});
