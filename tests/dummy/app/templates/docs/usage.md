# Usage

## Requirements

To use AddonDocs, your addon must have a `devDependency` of **Ember v2.8** or higher.

Note that your addon can still support older versions of Ember – it's just that you won't be able to run your AddonDocs documentation site against those older versions. (This means you also cannot write acceptance/application tests against your docs sites on older versions of Ember.)


### Node version

Due to [this issue](https://github.com/ember-learn/ember-cli-addon-docs/issues/1669) there is a requirement for consuming app to use [node>=20.19](https://nodejs.org/en/blog/release/v20.19.0/). Otherwise you might get following error during build:

```
require() of ES Module .../.pnpm/@handlebars+parser@file+..+handlebars-parser/node_modules/@handlebars/parser/dist/cjs/index.js not supported.
Instead change the require of index.js in null to a dynamic import() which is available in all CommonJS modules.
```


## Installation

```sh
ember install ember-cli-addon-docs
```

## Visual Studio Code integration

To get AddonDocs autocomplete in your projects, install [els-addon-docs](https://github.com/lifeart/els-addon-docs) for [Unstable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable) as a `devDependency` for your project. 

<!-- ## New addons


## Existing addons -->
