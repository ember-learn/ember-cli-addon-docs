# Ember CLI Addon Docs Changelog

## 0.1.0

Update notes:

First release! We can start tracking "breaking" changes before 1.0.

If you were already using addon docs, this release

- Removed the global app navbar. You can see how we're using it in this dummy app - just move `{{docs-navbar}}` from `application.hbs` to `index.hbs`.

- Updated the design of the docs-viewer, to include the project name & version. This data is inferred from your project's `package.json`.
