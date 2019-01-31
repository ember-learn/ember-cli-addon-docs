'use strict';

const QUnit = require('qunit'), test = QUnit.test;
const stripIndent = require('common-tags').stripIndent;
const compileMarkdown = require('../../../lib/utils/compile-markdown');

QUnit.module('Unit | compile-markdown', function(hooks) {
  test('compacting curly paragraphs', function(assert) {
    let input = stripIndent`
      {{#foo-bar}}

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>{{#foo-bar}} {{/foo-bar}}</p></div>
    `;

    assert.equal(result, expected);
  });

  test('compacting angle bracket paragraphs', function(assert) {
    let input = stripIndent`
      <FooBar>

      </FooBar>
    `;

    // TODO: there is a space left before the closing tag but build is not broken :)
    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><FooBar>

       </FooBar></div>
    `;

    assert.equal(result, expected);
  });

  test('compacting implicit code blocks', function(assert) {
    // Surrounding whitespace + 4-space indent = code block in MD
    let input = stripIndent`
      {{#foo-bar}}

          hello

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>{{#foo-bar}} hello {{/foo-bar}}</p></div>
    `;

    assert.equal(result, expected);
  });

  test('classic components remain unescaped', function(assert) {
    let input = stripIndent`
      {{#foo-bar prop="value" otherProp='value'}}

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>{{#foo-bar prop="value" otherProp='value'}} {{/foo-bar}}</p></div>
    `;

    assert.equal(result, expected);
  });

  test('angle bracket contextual components remain unescaped', function(assert) {
    let input = stripIndent`
      <foo.bar @prop={{value}}></foo.bar>
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p><foo.bar @prop={{value}}></foo.bar></p></div>
    `;

    assert.equal(result, expected);
  });

  test('using opening curlies inside backticks shouldn\'t compact paragraphs', function(assert) {
    let input = stripIndent`
      Foo bar is \`{{#my-component}}\`.

      Another paragraph.
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>Foo bar is <code>&#123;&#123;#my-component&#125;&#125;</code>.</p>
      <p>Another paragraph.</p></div>
    `;

    assert.equal(result, expected);
  });

  test('using opening angle brackets inside backticks shouldn\'t compact paragraphs', function(assert) {
    let input = stripIndent`
      Foo bar is \`<My component>\`.

      Another paragraph.
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>Foo bar is <code>&lt;My component&gt;</code>.</p>
      <p>Another paragraph.</p></div>
    `;

    assert.equal(result, expected);
  });
});
