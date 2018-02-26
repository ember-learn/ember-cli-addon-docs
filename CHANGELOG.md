# Ember CLI Addon Docs Changelog

## Unreleased

- **Breaking change**: Versioned deployment has been overhauled, impacting the deployed layout of files on `gh-pages` and changing the API available in `config/addon-docs.js`. See [Migrating to 0.2.x](#migrating-to-02x) below for more details.
- **Breaking change**: We no longer attempt to abort from within when running `ember deploy` on a non-`master` branch or a non-default Ember Try scenario. You should instead guard the invocation of `ember deploy` itself in your `.travis.yml` or equivalent.

### Migrating to 0.2.x

TODO @dfreeman finish filling me out

## 0.1.4

- **Breaking change**: You now must always pass the file extension into the DocsSnippet component: {{docs-snippet name='foo.js'}}

- Addon docs now works in Fastboot

And more bug fixes.

## 0.1.3

Bug fixes.

## 0.1.2

Style tweaks.

## 0.1.1

More style updates. Updates:

- Use `docs-link` anywhere in your MD files where you were using `link-to`, as we now style by class rather than descendents.

## 0.1.0

First release! We can start tracking "breaking" changes before 1.0.

If you were already using addon docs, this release

- Removes the global app navbar. You can see how we're using it in this dummy app - just move `{{docs-navbar}}` from `application.hbs` to `index.hbs`.

- Updates the design of the docs-viewer, to include the project name & version. This data is inferred from your project's `package.json`.
