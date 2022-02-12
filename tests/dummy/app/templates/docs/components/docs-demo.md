# Docs Demo

This component provides you with a way to show example code. It also renders the actual template used to generate the example, so you don't have to worry about keeping the code snippet and the live example in sync.

It's also an important part of your addon's testing story. If you write demos for most of your addon's functionality in your documentation app using this helper component, and then write acceptance tests against those demos, your acceptance tests will accomplish two things:

- They verify your addon's behavior
- They ensure all of that behavior is working in your docs site, and up-to-date with your addon's actual APIs

This saves you from ever having to remember that second step of "updating the docs" every time you change your library.

Of course, if your addon's components have some edge cases that would muddle up your documentation site too much, you can fall back to using integration tests. But try to keep most of the behavior in the docs pages — that way your users will know about it.

## Basic usage

Let's look at a basic example:

{{! BEGIN-SNIPPET docs-demo-basic-src.hbs }}
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
{{! END-SNIPPET }}

Here's the code that rendered the above demo (you can copy-paste this block to get going in your own app):

<DocsSnippet @name="docs-demo-basic-src.hbs"/>

To explain,

- `<DocsDemo/>` is the wrapping component
- The contextual component `<demo.example></demo.example>` provides a wrapper to display your example. You'll pass a block to this component with the actual code you're demoing - for example, showing off how to use your button.
- You also need to pass a `@name=` to demo.example in order to identify your snippet.
- Finally, the `<demo.snippet>` component lets you render different named snippets that you've identified via demo.example wrappers or other code comment blocks in your source.

## Multiple snippets

You can render multiple snippets to support your example. This can be useful when part of your example relies on code defined elsewhere, for example in a controller or stylesheet.

Use a file extension to help `<DocsSnippet/>` identify and properly syntax highlight your snippet. Templates end in `.hbs`, JavaScript snippets end in `.js`, stylesheets in `.css` or `.scss`.

<DocsDemo as |demo|>
  <demo.example @name="docs-demo-multiple.hbs">
    {{!-- BEGIN-SNIPPET docs-demo-multiple.hbs --}}
    <button 
      class="docs-btn" 
      {{on "click" this.toggleIsShowing}}
    >
      Press me!
    </button>

    <p class="docs-mt-4">
      {{#if this.isShowing}}
        Yep
      {{else}}
        Nope
      {{/if}}
    </p>
    {{!-- END-SNIPPET --}}
  </demo.example>

  <demo.snippet @name="docs-demo-multiple.hbs"/>
  <demo.snippet @name="docs-demo-multiple.js" @label="component.js"/>
</DocsDemo>

## Custom Snippet Handling

If you wish to override the inferred label or syntax highlighting for a snippet, you can specify `label` and `language` properties.

{{!-- BEGIN-SNIPPET docs-demo-custom-src.hbs --}}
<DocsDemo as |demo|>
  <demo.example @name="docs-demo-custom.md">
    <pre>
      # Markdown
      - Has syntax highlighting, too
    </pre>
  </demo.example>

  <demo.snippet @name="docs-demo-custom-src.hbs" @label="Source"/>
  <demo.snippet
    @name="docs-demo-custom.md"
    @label="My Custom Label"
    @language="markdown"
  />
</DocsDemo>
{{!-- END-SNIPPET --}}
