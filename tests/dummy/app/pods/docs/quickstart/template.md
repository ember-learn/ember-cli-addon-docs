# Quickstart

This quickstart guide will get you going with a docs site for your brand new addon.

1. **Install the addon.**

  ```
  ember install ember-learn/ember-cli-addon-docs
  ```

2. **Add the docs route.** Open `tests/dummy/app/router.js` and add a route named `docs`. Go ahead and make it nested, since this is where you'll be defining additional documentation pages.

  ```js
  // tests/dummy/app/router.js
  Router.map(function() {
    this.route('docs', function() {
    });
  });
  ```

3. **Add a navbar.** Open your application template and add the DocsNavbar component, customizing its properties for your project.

  ```hbs
  {{! // tests/dummy/app/templates/application.hbs }}
  {{docs-navbar
    logo='ember-cli'
    name='Addon Docs'
    githubUrl='https://github.com/ember-learn/ember-cli-addon-docs'}}

  {{outlet}}
  ```

4. **Create your docs skeleton.** Create a template for the `docs` route and add the DocsViewer component.

  ```hbs
  {{! tests/dummy/app/pods/docs/template.hbs }}
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
  ```

5. **Fill out the index of your docs page.** We called it Overview but you can call it whatever you want. Since Addon Docs supports markdown templates out of the box, we can make this a Markdown file.

  ```md
  <!-- tests/dummy/app/templates/docs/index.md -->
  # Overview

  This is my new addon, and it rocks!
  ```

6. **Add a 404 route.** Add a route to the end of your router and create an associated template.

  ```js
  // tests/dummy/app/router.js
  this.route('not-found', { path: '/*path' });
  ```

  <br />

  ```hbs
  {{! tests/dummy/app/templates/not-found.hbs  }}
  <div class="docs-container">
    <h1>Not found</h1>
    <p>This page doesn't exist. {{#link-to 'index'}}Head home?{{/link-to}}</p>
  </div>
  ```
8. **Add more docs pages.** It's up to you how to structure your docs - use the Snippet, Viewer and Demo components to help you write your documentation. Let's add another page to ours: we'll add the route, link to our docs viewer, and the actual template.

  ```js
  // tests/dummy/app/router.js
  this.route('docs', function() {
    this.route('installation');
  });
  ```

  <br />

  ```hbs
  {{! tests/dummy/app/templates/docs.hbs }}
  {{#viewer.nav as |nav|}}
    {{nav.item 'Installation' 'docs.installation'}}
  {{/viewer.nav}}
  ```

  <br />

  ```md
  <!-- tests/dummy/app/templates/docs/installation.md -->
  # Installation

  To install My Addon, run...
  ```

8. **Round out your site.**
  - **Add a favicon.** We recommend using [Ember CLI Favicon]( https://github.com/davewasmer/ember-cli-favicon).

  - **Install [Ember Router Scroll](https://github.com/dollarshaveclub/ember-router-scroll).**
