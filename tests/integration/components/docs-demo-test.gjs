import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import DemoCounter from 'dummy/components/demo-counter';
import DemoGreeting from 'dummy/components/demo-greeting';

module('Integration | Component | docs-demo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders gjs/gts examples and their snippets', async function (assert) {
    await render(
      <template>
        <DocsDemo as |demo|>
          <demo.example @name="docs-demo-gts-test.hbs">
            <DemoCounter @initial={{2}} />
            <DemoGreeting @name="world" />
          </demo.example>

          <demo.snippet @name="docs-demo-counter.gts" />
          <demo.snippet @name="docs-demo-greeting.gjs" />
        </DocsDemo>
      </template>,
    );

    assert.dom('[data-test-demo-counter]').hasText('Clicked 2 times');
    assert.dom('[data-test-demo-greeting]').hasText('Hello, world!');

    await click('[data-test-demo-counter]');
    assert.dom('[data-test-demo-counter]').hasText('Clicked 3 times');

    assert.dom('.docs-demo__snippets-nav button').exists({ count: 2 });
    assert
      .dom('.docs-demo__snippets-nav button:nth-child(1)')
      .hasText('component.gts');
    assert
      .dom('.docs-demo__snippets-nav button:nth-child(2)')
      .hasText('component.gjs');

    assert.dom('pre.gts').includesText('class DemoCounter');
    assert.dom('pre.gts .language-handlebars').includesText('{{this.count}}');
    assert.dom('pre.gts .hljs-tag').includesText('<template>');

    await click('.docs-demo__snippets-nav button:nth-child(2)');

    assert.dom('pre.gjs').includesText('const Greeting');
    assert.dom('pre.gjs .language-handlebars').includesText('{{@name}}');
  });
});
