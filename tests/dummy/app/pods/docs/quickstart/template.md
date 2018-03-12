# Quickstart

This quickstart guide will get you going with a docs site for your brand new addon.

1. **Install the addon.**

  ```
  ember install ember-cli-addon-docs
  ```

2. **Add the required routes.** Open `tests/dummy/app/router.js` and add the following route definitions:

  {{#docs-snippet name='quickstart-router.js' title='tests/dummy/app/router.js'}}
    this.route('docs', function() {
      this.route('api', function() {
        this.route('item', { path: '/*path' });
      });
    });
  {{/docs-snippet}}

3. **Create your app skeleton.** You can add the global keyboard shortcuts component to enable keyboard navigation around your docs site (use `?` to show the help window). Here's our application template:

  {{docs-snippet name="docs-demo-application-template.hbs" title="tests/dummy/app/templates/application.hbs"}}

4. **Create your docs skeleton.** Create a template for the `docs` route and add the DocsViewer component.

  {{#docs-snippet name='quickstart-skeleton.hbs' title='tests/dummy/app/pods/docs/template.hbs'}}
    {{#docs-viewer as |viewer|}}

      {{#viewer.nav as |nav|}}
        {{nav.item 'Overview' 'docs.index'}}
      {{/viewer.nav}}

      {{#viewer.main}}
        <div class="docs-container docs__center">
          <div class="docs-section">
            {{outlet}}
          </div>
        </div>
      {{/viewer.main}}

    {{/docs-viewer}}
  {{/docs-snippet}}

5. **Fill out the index of your docs page.** We called it Overview but you can call it whatever you want. Since Addon Docs supports markdown templates out of the box, we can make this a Markdown file.

  {{#docs-snippet name='quickstart-markdown.md' title='tests/dummy/app/templates/docs/index.md' language='markdown'}}
    # Overview

    This is my new addon, and it rocks!
  {{/docs-snippet}}

6. **Add a 404 route.** Add a route to the end of your router and create an associated template.

  {{#docs-snippet name='quickstart-404.js' title='tests/dummy/app/router.js'}}
    this.route('not-found', { path: '/*path' });
  {{/docs-snippet}}

  {{#docs-snippet name='quickstart-404.hbs' title='tests/dummy/app/templates/not-found.hbs'}}
    <div class="docs-container">
      <h1>Not found</h1>
      <p>This page doesn't exist. {{#link-to 'index'}}Head home?{{/link-to}}</p>
    </div>
  {{/docs-snippet}}

8. **Add more docs pages.** It's up to you how to structure your docs - use the Snippet, Viewer and Demo components to help you write your documentation. Let's add another page to ours: we'll add the route, link to our docs viewer, and the actual template.

  {{#docs-snippet name='quickstart-more-docs.js' title='tests/dummy/app/router.js'}}
    this.route('docs', function() {
      this.route('installation');
    });
  {{/docs-snippet}}

  {{#docs-snippet name='quickstart-more-nav.hbs' title='tests/dummy/app/templates/docs.hbs'}}
    {{#viewer.nav as |nav|}}
      {{nav.item 'Installation' 'docs.installation'}}
    {{/viewer.nav}}
  {{/docs-snippet}}

  {{#docs-snippet name='quickstart-installation-readme.md' title='tests/dummy/app/templates/docs/installation.md'}}
    # Installation

    To install My Addon, run...
  {{/docs-snippet}}

8. **Round out your site.**

* **Add a favicon.** We recommend using [Ember CLI Favicon](https://github.com/davewasmer/ember-cli-favicon).

* **Install [Ember Router Scroll](https://github.com/dollarshaveclub/ember-router-scroll).**
