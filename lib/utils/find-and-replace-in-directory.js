/* eslint-disable no-console */

'use strict';

const fs = require('fs-extra');
const path = require('path');

function replaceAddonDocsRootURL(contents, addonDocsRootURL, encodedVersion) {
  return contents
    .replace('%2FADDON_DOCS_ROOT_URL%2F', encodeURIComponent(addonDocsRootURL))
    .replace(/\/?ADDON_DOCS_ROOT_URL\/?/g, addonDocsRootURL)
    .replace(/%22ADDON_DOCS_DEPLOY_VERSION%22/g, encodedVersion);
}

function processFile(filePath, addonDocsRootURL, encodedVersion) {
  const contents = fs.readFileSync(filePath, 'utf-8');

  // Write the updated content to the file
  fs.writeFileSync(
    filePath,
    replaceAddonDocsRootURL(contents, addonDocsRootURL, encodedVersion),
  );
}

function findAndReplaceInDirectory(
  directory,
  addonDocsRootURL,
  encodedVersion,
) {
  fs.readdir(directory, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    entries.forEach((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        findAndReplaceInDirectory(fullPath, addonDocsRootURL, encodedVersion);
      } else if (entry.isFile()) {
        // Process files
        processFile(fullPath, addonDocsRootURL, encodedVersion);
      }
    });
  });
}

module.exports = {
  findAndReplaceInDirectory,
  replaceAddonDocsRootURL,
};
