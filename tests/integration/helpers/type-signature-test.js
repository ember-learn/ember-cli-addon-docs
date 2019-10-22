import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Helpers | type-signature', function(hooks) {
  setupRenderingTest(hooks);

  test('renders a simple getter signature', async function(assert) {
    this.set('item', {
      name: 'foo',
      hasGetter: true,
      type: 'string'
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'get foo: string');
  });

  test('renders a simple setter signature', async function(assert) {
    this.set('item', {
      name: 'foo',
      hasSetter: true,
      type: 'string'
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'set foo: string');
  });

  test('renders a simple getter signature', async function(assert) {
    this.set('item', {
      name: 'foo',
      hasGetter: true,
      hasSetter: true,
      type: 'string'
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'get/set foo: string');
  });

  test('renders a simple variable', async function(assert) {
    this.set('item', { name: 'foo', type: 'string' });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'foo: string');
  });

  test('renders a simple function signature', async function(assert) {
    this.set('item', { name: 'foo', params: [], returns: { type: 'string' } });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'foo(): string');
  });

  test('renders static and access modifiers', async function(assert) {
    this.set('item', { name: 'foo', type: 'string', isStatic: true, access: 'private' });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'private static foo: string');
  });

  test('renders functions with optional and rest params', async function(assert) {
    this.set('item', {
      name: 'foo',
      params: [
        { name: 'a', type: 'number' },
        { name: 'b', type: 'string', isOptional: true },
        { name: 'c', type: 'any[]', isRest: true }
      ]
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'foo(a: number, b?: string, ...c: any[]): any');
  });

  test('renders functions with type params', async function(assert) {
    this.set('item', {
      name: 'foo',
      typeParams: ['T, U extends PromiseLike&lt;T&gt;'],
      params: [{ name: 'value', type: 'U' }],
      returns: { type: 'T' },
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'foo<T, U extends PromiseLike<T>>(value: U): T');
  });

  test('renders functions with multiple signatures', async function(assert) {
    this.set('item', {
      name: 'foo',
      signatures: [
        {
          params: [],
          returns: { type: 'Promise&lt;void&gt;' }
        },
        {
          typeParams: ['T'],
          params: [{ name: 'value', type: 'T' }],
          returns: { type: 'Promise&lt;T&gt;' }
        }
      ]
    });

    await render(hbs`{{type-signature item}}`);

    assert.equal(this.element.innerText, 'foo(): Promise<void>\nfoo<T>(value: T): Promise<T>');
  });
});
