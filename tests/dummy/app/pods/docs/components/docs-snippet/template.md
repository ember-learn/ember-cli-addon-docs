# Docs Snippet

Easily render a code snippet with syntax highlighting and a copy-to-clipboard button.

## Handlebars

To render a Handlebars snippet from one of your templates, wrap it in a `DocsSnippet` component:

{{docs/components/docs-snippet/demo1}}

All snippets must have a globally unique name.

Note that the block-form of `DocsSnippet` won't actually execute your template code, it will just capture the static code and render the snippet. Think of it like Markdown code fences that you can use in your Handlebars templates.

If you want the code to actually render and also show the snippet, check out the {{docs-link 'Docs Demo component' 'docs.components.docs-demo'}}.

## JavaScript and CSS

You can also render snippets from other files in your app, like JavaScript and CSS files.

To do this, first mark up the source you want to display using comments that start with `BEGIN—SNIPPET` and `END—SNIPPET`.

`BEGIN—SNIPPET` should be followed by a name, which you can use to identify the snippet.

{{docs/components/docs-snippet/demo2}}

Then in any of your templates, you can use the non-block form of `docs-snippet` to render your named snippet:

{{docs/components/docs-snippet/demo3}}

Be sure to include the file extension.

Code snippets are provided by the [`ember-code-snippet`](https://github.com/ef4/ember-code-snippet) addon and are made available to your app via the `dummy/snippets` importable ES6 module. If you ever want to debug which snippets are getting registered, you can open this module in your devtools (+O, dummy/snippet).

## Customizing Snippets

By default, snippets will render with a button allowing readers to copy the snippet's contents to their clipboard. You can turn this off by passing `showCopy=false` to `{{docs-snippet}}`

You can override the detected language for syntax highlighting in your snippet by specifying a `language` property.

Finally, you can use the `title` property to specify a header for your snippet, for instance to specify the file your snippet would be found in.

Here's what that looks like:

{{docs/components/docs-snippet/demo4}}
