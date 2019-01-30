# Docs Demo

This component provides you with a way to show example code. It also renders the actual template used to generate the example, so you don't have to worry about keeping the code snippet and the live example in sync.

It's also an important part of your addon's testing story. If you write demos for most of your addon's functionality in your documentation app using this helper component, and then write acceptance tests against those demos, your acceptance tests will accomplish two things:

- They verify your addon's behavior
- They ensure all of that behavior is working in your docs site, and up-to-date with your addon's actual APIs

This saves you from ever having to remember that second step of "updating the docs" every time you change your library.

Of course, if your addon's components have some edge cases that would muddle up your documentation site too much, you can fall back to using integration tests. But try to keep most of the behavior in the docs pages — that way your users will know about it.

## Basic usage

Let's look at a basic example:

{{docs/components/docs-demo/demo1}}

Here's the code that rendered the above demo (you can copy-paste this block to get going in your own app):

{{docs-snippet name='docs-demo-basic-src.hbs'}}

To explain,

- `{{docs-demo}}` is the wrapping component
- The contextual component `{{#demo.example}}{{/demo.example}}` provides a wrapper to display your example. You'll pass a block to this component with the actual code you're demoing - for example, showing off how to use your button.
- You also need to pass a `name=` to demo.example in order to identify your snippet.
- Finally, the `{{demo.snippet}}` component lets you render different named snippets that you've identified via demo.example wrappers or other code comment blocks in your source.

## Multiple snippets

You can render multiple snippets to support your example. This can be useful when part of your example relies on code defined elsewhere, for example in a controller or stylesheet.

Use a file extension to help docs-snippet identify and properly syntax highlight your snippet. Templates end in `.hbs`, JavaScript snippets end in `.js`, stylesheets in `.css` or `.scss`.

{{docs/components/docs-demo/demo2}}

## Custom Snippet Handling

If you wish to override the inferred label or syntax highlighting for a snippet, you can specify `label` and `language` properties.

{{docs/components/docs-demo/demo3}}
