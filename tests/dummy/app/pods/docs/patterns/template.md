# Patterns

Here's a summary of the patterns we encourage addon authors to follow when documenting their work.

{{! FIXME these links don't work  with the 'hash' locationType}}
- [Document your addon using its dummy app](#document-your-addon-using-its-dummy-app)
- [Author in Markdown](#author-in-markdown)
- [Design for your audience](#design-for-your-audience)
- [Write versioned guides](#write-versioned-guides)
- [Write versioned API references](#write-versioned-api-references)
- [Deploy your dummy app to GitHub Pages](#deploy-your-dummy-app-to-github-pages)
- [Miscellaneous](#miscellaneous)

## Document your addon using its dummy app

One of the more surprising results to come out of the addon community is the effectiveness of using an addon's dummy application as a full-fledged document site.

Every addon comes with a fully bootstrapped Ember application that can be found in `/tests/dummy` and runs during `ember s`. This dummy app is primarily intended to be used for acceptance tests; but it turns out that configuring it as a production application to be used as your docs site has many advantages:

- **You can show off your addon in the context of a real Ember app.** The dummy app provides you with a perfect sandbox for rendering all the variations of your UI components in an actual Ember application.

- **You can write your docs using familiar technology.** You're an Ember developer, and so are your users. Using the dummy app means your docs site is built with tech you and your users know, making it easier for you and the community to maintain and improve your docs. Compare this to something like Jekyll, which requires your users to have Ruby installed and to have a basic understanding of Gemfiles.

- **It encourages you to write acceptance tests, and when you do, ensures your docs are never outdated.** Whenever you write acceptance tests for new behavior, you need to add that behavior to your dummy app. But now that your dummy app is your docs site, you won't just add throwaway or confusing examples — you'll be encouraged to find an appropriate place for them, since your dummy app is now an organized app that already documents all your addon's functionality for your end users.

  Once you document the new behavior on your doc site, you can now write an acceptance test against it, ensuring (1) that your code is functioning correctly, and (2) that your docs are accurate and up-to-date. Win-win!

## Author in Markdown

Authoring your docs pages in Markdown makes it easy for you and your contributors to read and edit your site.

To make a route a Markdown document, simply create a `template.md` file instead of a `template.hbs`.

To show additional functionality, create route-specific components and render them from your `template.md` files:

```md
## My Component demo

Here's a demo of it working:

{{docs/my-component/demo1}}
```

In addition to authoring normal Markdown content, you can

- Use an `<aside>` element. This is good for calling out important info or long-standing bug fixes that were part of a release.

<aside>
  Here's an example of an aside.
</aside>

- Use Handlebars helpers. For example, you can use `link-to` to render a link to {{link-to 'the home page' 'index'}}, or you can even render a component.

## Design for your audience

The design of your docs site should meet the needs of your users — other busy software developers. It needs to explain what problems your library solves and the principles behind your approach, but also serve as a quick reference for developers who are already familiar with your addon, and are just looking up an API.

We've included a {{link-to 'Docs Viewer' 'docs.components.docs-viewer'}}  component to help you with your site's design and functionality. The entire layout of the current page comes from this component. It's an opinionated setup intended to be used with a dedicated `docs` route.

It features the nav area you see on the left and a main area for the content in the middle, with both sections filling up the available height and independently scrollable. This is a nice pattern used by many other online documentation viewers that gives your users easy access to navigation while also letting them focus on individual pieces of content without getting overwhelmed.

The nav is designed to be flexible enough for simple and complex addons. You should feel free to structure it as you see fit (some addons will need one section for Components but some will want more, and so on).

The large main area is also useful for addons that need more space to illustrate a concept or show a demo. However, most pages in an addon's docs site should be optimized for reading.

Typography choices were made primarily for readability. Measure, a typographic term for the number of characters is a line of text, is also an important aspect of readability, so by default most of the layouts you see will be wrapped with an appropriate max-width. To reiterate one of our main goals for the project, we want addon authors to get these patterns for free so they can focus on actually documenting and testing their addons.

## Write versioned guides

Write this...

## Write versioned API references

Autogenerated for you as a route on `DocsViewer.nav`.

Write this...

## Deploy your dummy app to GitHub Pages

We suggest deploying your dummy app to GitHub Pages, as it's a simple place available to every GitHub project to host your documentation site. Once you have this set up, you can even automate deployment as part of your Travis CI builds.

For more details, see the {{link-to 'Deploying' 'docs.deploying'}} section of the guides.

## Miscellaneous

- **Pods vs classic app layout.** You are free to use either classic or pods layout. This app is built using pods, in case you'd like to use it as a reference.
