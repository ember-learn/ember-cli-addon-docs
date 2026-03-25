'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Prember URL enumeration for ember-cli-addon-docs.
 *
 * Automatically discovers all documentation pages by reading
 * the generated docs JSON and search index from the build output.
 *
 * Usage in ember-cli-build.js:
 *
 *   const app = new EmberAddon(defaults, {
 *     prember: {
 *       urls: require('ember-cli-addon-docs/lib/prember-urls'),
 *     },
 *   });
 *
 * @param {Object} options
 * @param {string} options.distDir - Path to the built dist directory
 * @returns {string[]} Array of URLs to pre-render
 */
module.exports = function premberUrls({ distDir }) {
  let urls = new Set(['/']);

  // Discover guide/template pages and API pages from the search index.
  // The search index contains all indexed documents with their route info.
  let searchIndexPath = path.join(
    distDir,
    'ember-cli-addon-docs',
    'search-index.json',
  );

  if (fs.existsSync(searchIndexPath)) {
    let searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

    for (let doc of Object.values(searchIndex.documents || {})) {
      if (doc.type === 'template' && doc.route) {
        // Skip internal/non-page routes
        if (
          doc.route === 'application' ||
          doc.route === 'not-found' ||
          doc.route.startsWith('templates.') ||
          doc.route.startsWith('pods.')
        ) {
          continue;
        }

        let routePath = doc.route.replace(/\./g, '/').replace(/\/index$/, '');
        if (routePath === 'index') routePath = '';
        urls.add('/' + routePath);
      }
    }
  }

  // Discover API pages from the main project's docs JSON navigationIndex.
  // We read all JSON files in docs/ and use the project ID to build URLs.
  // The main project maps to /docs/api/, additional projects would need
  // custom URL mapping from the consuming app.
  let docsDir = path.join(distDir, 'docs');

  if (fs.existsSync(docsDir)) {
    let files = fs
      .readdirSync(docsDir)
      .filter((f) => f.endsWith('.json'))
      .sort();

    for (let i = 0; i < files.length; i++) {
      let docsJson = JSON.parse(
        fs.readFileSync(path.join(docsDir, files[i]), 'utf8'),
      );
      let projectData = Array.isArray(docsJson.data)
        ? docsJson.data[0]
        : docsJson.data;
      let navIndex = projectData?.attributes?.navigationIndex || [];

      // Only generate /docs/api/ URLs for the first (alphabetically)
      // project. Additional projects have their own route prefixes
      // that we can't determine automatically.
      if (files.length === 1 || i === 0) {
        urls.add('/docs');

        for (let section of navIndex) {
          for (let item of section.items) {
            urls.add(`/docs/api/${item.path}`);
          }
        }
      }
    }
  }

  return [...urls];
};
