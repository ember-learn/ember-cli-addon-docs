# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ember-cli-addon-docs is an Ember addon that generates documentation sites for other Ember addons. It provides components for building doc sites, a build pipeline that extracts API docs and search indexes, and a deploy pipeline for GitHub Pages.

## Commands

- **Install:** `pnpm install`
- **Dev server:** `pnpm start` (serves dummy app at http://localhost:4200)
- **Build:** `pnpm build`
- **Lint all:** `pnpm lint`
- **Lint fix:** `pnpm lint:fix`
- **Run all tests:** `pnpm test`
- **Ember tests only:** `pnpm test:ember`
- **Ember tests in watch mode:** `pnpm test:ember --server`
- **Node tests only:** `pnpm test:node` (mocha, runs tests in `tests-node/`)
- **Test app tests:** `pnpm test:test-apps` (runs tests in `test-apps/new-addon`)

Uses pnpm as the package manager. The workspace includes `test-apps/*`.

## Architecture

### Build Pipeline (lib/)

The core build logic lives in `index.js` and `lib/`. During Ember's build process:

1. **`index.js`** — Main addon entry point. Hooks into Ember CLI's `treeForApp`, `treeForAddon`, `treeForPublic`, and `treeForVendor`. Compiles markdown templates, extracts API docs via plugin registry, and builds a search index.

2. **`lib/broccoli/`** — Broccoli plugins for the build pipeline:
   - `docs-compiler.js` — Compiles extracted API documentation into JSON API format
   - `search-indexer.js` — Builds a lunr.js search index from docs and template content
   - `docs-filter.js` / `hbs-content-filter.js` — Broccoli filters for processing files

3. **`lib/preprocessors/`** — Template preprocessors:
   - `markdown-template-compiler.js` — Compiles `.md` files into Handlebars templates
   - `hbs-content-extractor.js` — Extracts content from HBS templates for search indexing

4. **`lib/deploy/`** — ember-cli-deploy plugin for deploying docs to GitHub Pages

5. **`lib/models/plugin-registry.js`** — Registry for doc generation plugins (e.g., `ember-cli-addon-docs-yuidoc`)

### Runtime Addon (addon/)

Ember Octane components and services that consuming addons use in their doc sites:

- **Components:** `docs-viewer`, `docs-header`, `docs-hero`, `docs-demo`, `docs-snippet`, `docs-code-highlight`, `api/` (API doc viewer components), etc.
- **Services:** `docs-routes` (navigation), `docs-search` (lunr-based search), `project-version` (version management)
- **Styles:** Uses Tailwind CSS 1.x compiled via PostCSS/Sass pipeline

### App Re-exports (app/)

Standard Ember addon pattern — re-exports addon modules into the consuming app's namespace.

### Blueprints (blueprints/)

- `ember-cli-addon-docs` — Default blueprint run on `ember install`
- `docs-page` — Generator for new documentation pages

### Sandbox (sandbox/)

A "sandbox" addon used as a secondary documented project in the dummy app, demonstrating multi-project documentation support.

### Tests

- `tests/` — Ember tests (acceptance, integration, unit) using QUnit, run via testem in Chrome
- `tests-node/` — Node.js unit tests using Mocha/Chai for the build pipeline code in `lib/`
- `test-apps/new-addon` — Separate test app in the pnpm workspace

### Key Concepts

- **Plugin system:** API doc extraction is pluggable via addons with keyword `ember-cli-addon-docs-plugin`. The default plugin is `ember-cli-addon-docs-yuidoc`.
- **`documentingAddonAt`:** Config option allowing a standalone app (not a dummy app) to document an addon at a specific path.
- **Version support:** The addon manages doc versions for deployment, with a "latest" version concept (`-latest`).
