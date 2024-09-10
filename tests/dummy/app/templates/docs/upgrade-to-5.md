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
        <p>The value is: {{this.val}}</p>
        <div>
          <Input @value={{this.val}} class="docs-border"/>
        </div>
      {{/demo.example}}

      {{demo.snippet "docs-demo-basic.hbs"}}
    {{/docs-demo}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-demo-after.hbs" @title="After">

    <DocsDemo as |demo|>
      <demo.example @name="docs-demo-basic.hbs">
        <p>I am a <strong>handlebars</strong> template!</p>
        <p>The value is: {{this.val}}</p>
        <div>
          <Input @value={{this.val}} class="docs-border"/>
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

### Header

`<DocsHeader/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax
1. Replace the `header.link` positional argument with a named `@route` argument

Example:

<DocsSnippet @name="upgrade-to-v5-header-before.hbs" @title="Before">

    {{#docs-header githubUrl="https://github.com/ember-learn/ember-cli-addon-docs" as |header|}}
      {{#header.link "index"}}
         Another route
      {{/header.link}}
    {{/docs-header}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-header-after.hbs" @title="After">

    <DocsHeader @githubUrl="https://github.com/ember-learn/ember-cli-addon-docs" as |header|>
      <header.link @route="index">
         Another route
      </header.link>
    </DocsHeader>
</DocsSnippet>

### Link

`<DocsLink/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax
2. Replace the `{{docs-link}}` positional arguments with named `@route` and/or `@model` arguments
3. blockless usage is *not* supported

Example:

<DocsSnippet @name="upgrade-to-v5-link-before.hbs" @title="Before">

    {{docs-link 'go to post' 'post' this.post.id}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-link-after.hbs" @title="After">

    <DocsLink @route="post" @model={{this.post.id}}>
      go to post
    </DocsLink>
</DocsSnippet>

### Viewer

`<DocsViewer/>` is now a glimmer component.

#### Actions:
1. Use angle bracket invocation syntax on the component and all its yielded components
2. Replace the `{{nav.item}}` positional arguments with named `@label`, `@route` and/or `@model` arguments
3. Replace the `{{nav.section}}` positional argument with named `@label` argument

Example:

<DocsSnippet @name="upgrade-to-v5-viewer-before.hbs" @title="Before">

    {{#docs-viewer as |viewer|}}
      {{#viewer.nav as |nav|}}
        {{nav.item "Introduction" "docs.index"}}
        {{nav.item "Usage" "docs.usage"}}

        {{#nav.subnav as |nav|}}
          {{nav.item "Subitem" "docs.items.subitem"}}
        {{/nav.subnav}}
      {{/viewer.nav}}

      {{#viewer.main}}
        {{outlet}}
      {{/viewer.main}}
    {{/docs-viewer}}
</DocsSnippet>

<DocsSnippet @name="upgrade-to-v5-viewer-after.hbs" @title="After">

    <DocsViewer as |viewer|>
      <viewer.nav as |nav|>
        <nav.item @label="Introduction" @route="docs.index" />
        <nav.item @label="Usage" @route="docs.usage" />

        <nav.subnav as |nav|>
          <nav.item @label="Subitem" @route="docs.items.subitem" />
        </nav.subnav>
      </viewer.nav>

      <viewer.main>
        {{outlet}}
      </viewer.main>
    </DocsViewer>
</DocsSnippet>