# Upgrade to AddonDocs 5.x

## 🚨 Breaking Changes

### Snippet

`<DocsSnippet/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax

Example:

<DocsSnippet @name="upgrade-to-v5-snippet-before.hbs" @title="Before">

    {{#docs-snippet name="your-snippet-name.hbs"}}
      <div id="foo">
        <img src="tomster.png" alt="Tomster"/>
      </div>
    {{/docs-snippet}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-snippet-after.hbs" @title="After">

    <DocsSnippet @name="your-snippet-name.hbs">
      <div id="foo">
        <img src="tomster.png" alt="Tomster"/>
      </div>
    </DocsSnippet>
</DocsSnippet>

### Demo

`<DocsDemo/>` and its sub-components are now glimmer components.

#### Actions:
1. Use angle bracket invocation syntax
1. Replace the `demo.snippet` positional argument with a named `@name` argument

Example:

<DocsSnippet @name="upgrade-to-v5-demo-before.hbs" @title="Before">

    {{#docs-demo as |demo|}}
      {{#demo.example name="docs-demo-basic.hbs"}}
        <p>I am a <strong>handlebars</strong> template!</p>
        <p>The value is: {{val}}</p>
        <div>
          {{input value=val class="docs-border"}}
        </div>
      {{/demo.example}}

      {{demo.snippet "docs-demo-basic.hbs"}}
    {{/docs-demo}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-demo-after.hbs" @title="After">

    <DocsDemo as |demo|>
      <demo.example @name="docs-demo-basic.hbs">
        <p>I am a <strong>handlebars</strong> template!</p>
        <p>The value is: {{val}}</p>
        <div>
          {{input value=val class="docs-border"}}
        </div>
      </demo.example>

      <demo.snippet @name="docs-demo-basic.hbs"/>
    </DocsDemo>
</DocsSnippet>


### Logo

`<DocsLogo/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax

Example:

<DocsSnippet @name="upgrade-to-v5-logo-before.hbs" @title="Before">

    {{docs-logo logo="ember-cli"}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-logo-after.hbs" @title="After">

    <DocsLogo @logo="ember-cli"/>
</DocsSnippet>

### Link

`<DocsLink/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax
2. Replace the `{{docs-link}}` positional argument with named `@route` and/or `@model` argument
3. blockless usage is *not* supported

Example:

<DocsSnippet @name="upgrade-to-v5-link-before.hbs" @title="Before">

    {{docs-link 'go to post' 'post' post.id}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-link-after.hbs" @title="After">

    <DocsLink @route="sandbox" @model={{post.id}}>
      Sandbox
    </DocsLink>
</DocsSnippet>