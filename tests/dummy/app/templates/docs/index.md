# What is AddonDocs?

Welcome addon author!

This project was created to help you document and showcase your addon using the accumulated knowledge of the addon community. After surveying several popular project sites we saw that they had much in common, though addon authors have had no easy way to share these techniques.

The app you're currently viewing is itself an example of an addon documented using Ember CLI AddonDocs (it is a fortunate dog-fooding position that we find ourselves in). This Ember application employs our thinking on best practices for layout, typography and design, and uses several features like

- Support for authoring pages in Markdown (this very page being an example – click *Edit this page* below to view the source)
- Interactive <DocsLink @route="docs.components.docs-hero">component demos</DocsLink>
- Autogenerated <DocsLink @route="docs.api.item" @model="components/docs-demo">API docs</DocsLink> from source code comments

and more.

The goal of this project is to make these features and patterns easily available to you in a way that doesn't stifle your creativity. We understand your addon may require unique pages to demo or test its functionality, and you may already have an existing site up and running. So we've taken care to break up our primitives so that you can pick and choose just what you need.

As with all open-source, our discovery of best practices is never finished. If you'd like to make a suggestion on any topic covered by this addon, please [open an issue](https://github.com/ember-learn/ember-cli-addon-docs/issues).
