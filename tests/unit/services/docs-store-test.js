import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | docs-store', function (hooks) {
  setupTest(hooks);

  function getStore(owner) {
    return owner.lookup('service:docs-store');
  }

  test('_loadPayload deserializes a JSON API payload with attributes', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: {
          name: 'my-addon',
          version: '1.0.0',
          navigationIndex: [],
        },
        relationships: {
          modules: { data: [] },
        },
      },
      included: [],
    });

    let project = store.peekRecord('project', 'my-addon');
    assert.ok(project, 'project record exists');
    assert.strictEqual(project.name, 'my-addon');
    assert.strictEqual(project.version, '1.0.0');
    assert.deepEqual(project.navigationIndex, []);
  });

  test('_loadPayload resolves hasMany relationships', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { name: 'my-addon' },
        relationships: {
          modules: {
            data: [{ type: 'module', id: 'my-addon/components/foo' }],
          },
        },
      },
      included: [
        {
          id: 'my-addon/components/foo',
          type: 'module',
          attributes: { file: 'my-addon/components/foo.js' },
          relationships: {
            components: { data: [] },
            classes: { data: [] },
          },
        },
      ],
    });

    let project = store.peekRecord('project', 'my-addon');
    assert.strictEqual(project.modules.length, 1);
    assert.strictEqual(project.modules[0].file, 'my-addon/components/foo.js');
  });

  test('_loadPayload resolves belongsTo relationships', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { name: 'my-addon' },
        relationships: { modules: { data: [] } },
      },
      included: [
        {
          id: 'child-class',
          type: 'class',
          attributes: { name: 'Child' },
          relationships: {
            parentClass: { data: { type: 'class', id: 'parent-class' } },
          },
        },
        {
          id: 'parent-class',
          type: 'class',
          attributes: { name: 'Parent' },
          relationships: { parentClass: { data: null } },
        },
      ],
    });

    let child = store.peekRecord('class', 'child-class');
    assert.ok(child.parentClass, 'parentClass is resolved');
    assert.strictEqual(child.parentClass.name, 'Parent');
  });

  test('peekRecord returns null for missing records', function (assert) {
    let store = getStore(this.owner);
    assert.strictEqual(store.peekRecord('project', 'nonexistent'), null);
  });

  test('peekAll returns all records of a type', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { name: 'my-addon' },
        relationships: { modules: { data: [] } },
      },
      included: [
        {
          id: 'mod-a',
          type: 'module',
          attributes: { file: 'a.js' },
        },
        {
          id: 'mod-b',
          type: 'module',
          attributes: { file: 'b.js' },
        },
      ],
    });

    let modules = store.peekAll('module');
    assert.strictEqual(modules.length, 2);
  });

  test('_loadPayload creates correct model types for components', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { name: 'my-addon' },
        relationships: { modules: { data: [] } },
      },
      included: [
        {
          id: 'my-comp',
          type: 'component',
          attributes: {
            name: 'MyComp',
            yields: [],
            arguments: [],
            accessors: [],
            methods: [],
            fields: [],
            tags: [],
          },
        },
      ],
    });

    let comp = store.peekRecord('component', 'my-comp');
    assert.ok(comp, 'component record exists');
    assert.true(comp.isComponent, 'uses Component model class');
    assert.strictEqual(comp.name, 'MyComp');
  });

  test('_loadPayload handles missing relationships gracefully', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { name: 'my-addon' },
      },
      included: [],
    });

    let project = store.peekRecord('project', 'my-addon');
    assert.ok(project, 'project exists even without relationships');
    assert.strictEqual(project.name, 'my-addon');
  });

  test('_loadPayload skips unknown types', function (assert) {
    let store = getStore(this.owner);

    store._loadPayload({
      data: {
        id: 'something',
        type: 'unknown-type',
        attributes: { name: 'test' },
      },
      included: [],
    });

    assert.strictEqual(store.peekAll('project').length, 0);
    assert.strictEqual(store.peekAll('module').length, 0);
  });
});
