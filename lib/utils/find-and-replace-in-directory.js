/* eslint-disable no-console */

'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * Replaces rootURL and deploy version tokens in file contents.
 *
 * The app is built with rootURL = '/' and deployVersion = 'ADDON_DOCS_DEPLOY_VERSION'.
 * At deploy time, these are rewritten to the real values.
 */
function replaceDeployTokens(contents, addonDocsRootURL, encodedVersion) {
  return (
    contents
      // Replace rootURL in the URI-encoded config meta tag: "rootURL":"/" → "rootURL":"/my-addon/versions/main/"
      .replace(
        /%22rootURL%22%3A%22%2F%22/g,
        `%22rootURL%22%3A%22${encodeURIComponent(addonDocsRootURL)}%22`,
      )
      // Replace asset paths: src="/assets/ → src="/my-addon/versions/main/assets/
      // and href="/assets/ → href="/my-addon/versions/main/assets/
      .replace(/((?:src|href)=")\/assets\//g, `$1${addonDocsRootURL}assets/`)
      // Replace webpack public path: ="\/assets\/" or ="/assets/"
      .replace(/="\/assets\/"/g, `="${addonDocsRootURL}assets/"`)
      // Replace bare /assets/ references in JS (webpack chunk loading etc.)
      .replace(/(["`])\/assets\//g, `$1${addonDocsRootURL}assets/`)
      // Handle the legacy ADDON_DOCS_ROOT_URL token for backward compatibility
      // with consuming apps that haven't updated their config yet
      .replace(
        '%2FADDON_DOCS_ROOT_URL%2F',
        encodeURIComponent(addonDocsRootURL),
      )
      .replace(/\/?ADDON_DOCS_ROOT_URL\/?/g, addonDocsRootURL)
      // Replace deploy version token
      .replace(/%22ADDON_DOCS_DEPLOY_VERSION%22/g, encodedVersion)
  );
}

function processFile(filePath, addonDocsRootURL, encodedVersion) {
  const contents = fs.readFileSync(filePath, 'utf-8');
  const updated = replaceDeployTokens(
    contents,
    addonDocsRootURL,
    encodedVersion,
  );

  if (updated !== contents) {
    fs.writeFileSync(filePath, updated);
  }
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
        findAndReplaceInDirectory(fullPath, addonDocsRootURL, encodedVersion);
      } else if (entry.isFile()) {
        processFile(fullPath, addonDocsRootURL, encodedVersion);
      }
    });
  });
}

module.exports = {
  findAndReplaceInDirectory,
  replaceDeployTokens,
};
