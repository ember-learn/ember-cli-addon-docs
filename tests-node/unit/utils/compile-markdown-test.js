'use strict';

const assert = require('chai').assert;
const stripIndent = require('common-tags').stripIndent;
const compileMarkdown = require('../../../lib/utils/compile-markdown');

describe('Unit | compile-markdown', function (hooks) {
  it('compacting curly paragraphs', function () {
    let input = stripIndent`
      {{#foo-bar}}

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p>{{#foo-bar}}

      {{/foo-bar}}</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting sequential curly bracket paragraphs - non-void angle bracket children', function () {
    let input = stripIndent`
      {{#foo-bar}}<Foo></Foo>{{/foo-bar}}

      {{#foo-bar}}<Foo></Foo>{{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p>{{#foo-bar}}<Foo></Foo>{{/foo-bar}}</p>

      <p>{{#foo-bar}}<Foo></Foo>{{/foo-bar}}</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting sequential curly bracket paragraphs - self-closing angle bracket children', function () {
    let input = stripIndent`
      {{#foo-bar}}<Foo/>{{/foo-bar}}

      {{#foo-bar}}<Foo></Foo>{{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p>{{#foo-bar}}<Foo/>{{/foo-bar}}</p>

      <p>{{#foo-bar}}<Foo></Foo>{{/foo-bar}}</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting angle bracket paragraphs', function () {
    let input = stripIndent`
      <FooBar>

      </FooBar>
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p><FooBar>

      </FooBar></p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting sequential angle bracket paragraphs - non-void angle bracket children', function () {
    let input = stripIndent`
      <Baz><Foo></Foo></Baz>

      <Baz><Foo></Foo></Baz>
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p><Baz><Foo></Foo></Baz></p>

      <p><Baz><Foo></Foo></Baz></p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting sequential angle bracket paragraphs - self-closing angle bracket children', function () {
    let input = stripIndent`
      <Baz><Foo/></Baz>

      <Baz><Foo></Foo></Baz>
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p><Baz><Foo/></Baz></p>

      <p><Baz><Foo></Foo></Baz></p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('compacting implicit code blocks', function () {
    // Surrounding whitespace + 4-space indent = code block in MD
    let input = stripIndent`
      {{#foo-bar}}

          hello

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p>{{#foo-bar}}

          hello

      {{/foo-bar}}</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('classic components remain unescaped', function () {
    let input = stripIndent`
      {{#foo-bar prop="value" otherProp='value'}}

      {{/foo-bar}}
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p>{{#foo-bar prop="value" otherProp='value'}}

      {{/foo-bar}}</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('angle bracket contextual components remain unescaped', function () {
    let input = stripIndent`
      <foo.bar @prop={{value}}></foo.bar>
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md">
      <p><foo.bar @prop={{value}}></foo.bar></p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it("using opening curlies inside backticks shouldn't compact paragraphs", function () {
    let input = stripIndent`
      Foo bar is \`{{#my-component}}\`.

      Another paragraph.
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>Foo bar is <code>&#123;&#123;#my-component&#125;&#125;</code>.</p>
      <p>Another paragraph.</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it("using opening angle brackets inside backticks shouldn't compact paragraphs", function () {
    let input = stripIndent`
      Foo bar is \`<My component>\`.

      Another paragraph.
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><p>Foo bar is <code>&lt;My component&gt;</code>.</p>
      <p>Another paragraph.</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('using code block simple case', function () {
    let input = stripIndent`
      \`\`\`hbs
        <FooBar>Hello</FooBar>
      \`\`\`

      This is after code block
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><pre class="docs-md__code"><code class="language-hbs"><span class="language-xml">  <span class="hljs-tag">&lt;<span class="hljs-name">FooBar</span>&gt;</span>Hello<span class="hljs-tag">&lt;/<span class="hljs-name">FooBar</span>&gt;</span></span>
      </code></pre>
      <p>This is after code block</p>
      </div>
    `;

    assert.equal(result, expected);
  });

  it('using code block with self-closing tag inside', function () {
    let input = stripIndent`
      \`\`\`hbs
      <form.Text
        @fieldName="name.first"
        @label="First Name"
      />
      \`\`\`

      This is after code block
    `;

    let result = compileMarkdown(input, { targetHandlebars: true });
    let expected = stripIndent`
      <div class="docs-md"><pre class="docs-md__code"><code class="language-hbs"><span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form.Text</span>
        @<span class="hljs-attr">fieldName</span>=<span class="hljs-string">&quot;name.first&quot;</span>
        @<span class="hljs-attr">label</span>=<span class="hljs-string">&quot;First Name&quot;</span>
      /&gt;</span></span>
      </code></pre>
      <p>This is after code block</p>
      </div>
    `;

    assert.equal(result, expected);
  });
});
