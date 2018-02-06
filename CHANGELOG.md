# Ember CLI Addon Docs Changelog

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
