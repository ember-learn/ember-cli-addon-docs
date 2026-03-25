'use strict';

const assert = require('chai').assert;
const {
  replaceDeployTokens,
} = require('../../../lib/utils/find-and-replace-in-directory');

describe('`deploy` | plugin test', function () {
  it('replaceDeployTokens in index.html (new format with rootURL=/)', function () {
    const contents = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2F%22%7D" />
        </head>
        <body>
          <script src="/assets/chunk.805.d0514e7e9edb751c6623.js"></script>
          <script src="/assets/chunk.524.385868f2db0b958b5ced.js"></script>
          <script src="/assets/vendor.js"></script>
          <script src="/assets/dummy.js"></script>
        </body>
      </html>
    `;
    const encodedVersion = encodeURIComponent(
      JSON.stringify({
        path: 'versions/main',
        name: 'main',
        sha: 'eef3',
        tag: null,
        key: 'main',
      }),
    );
    const addonDocsRootURL = '/my-addon/versions/main/';
    const actual = replaceDeployTokens(
      contents,
      addonDocsRootURL,
      encodedVersion,
    );
    const expected = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2Fmy-addon%2Fversions%2Fmain%2F%22%7D" />
        </head>
        <body>
          <script src="/my-addon/versions/main/assets/chunk.805.d0514e7e9edb751c6623.js"></script>
          <script src="/my-addon/versions/main/assets/chunk.524.385868f2db0b958b5ced.js"></script>
          <script src="/my-addon/versions/main/assets/vendor.js"></script>
          <script src="/my-addon/versions/main/assets/dummy.js"></script>
        </body>
      </html>
    `;

    assert.equal(actual, expected);
  });

  it('replaceDeployTokens in chunks (new format with /assets/)', function () {
    const chunk = '(e.children=[]),e),o.p="/assets/",(()=>{var e={143:0}';
    const encodedVersion = encodeURIComponent(
      JSON.stringify({
        path: 'versions/main',
        name: 'main',
        sha: 'eef3',
        tag: null,
        key: 'main',
      }),
    );
    const addonDocsRootURL = '/my-addon/versions/main/';
    const actual = replaceDeployTokens(chunk, addonDocsRootURL, encodedVersion);
    const expected =
      '(e.children=[]),e),o.p="/my-addon/versions/main/assets/",(()=>{var e={143:0}';
    assert.equal(actual, expected);
  });

  it('replaceDeployTokens handles legacy ADDON_DOCS_ROOT_URL token', function () {
    const contents = `
      <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2FADDON_DOCS_ROOT_URL%2F%22%7D" />
      <script src="/ADDON_DOCS_ROOT_URL/assets/vendor.js"></script>
    `;
    const encodedVersion = encodeURIComponent(JSON.stringify({ path: '' }));
    const addonDocsRootURL = '/my-addon/';
    const actual = replaceDeployTokens(
      contents,
      addonDocsRootURL,
      encodedVersion,
    );

    assert.include(actual, '%2Fmy-addon%2F');
    assert.include(actual, 'src="/my-addon/assets/vendor.js"');
  });

  it('replaceDeployTokens with root-level deploy (addonDocsRootURL=/)', function () {
    const contents = `
      <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2F%22%7D" />
      <script src="/assets/vendor.js"></script>
    `;
    const encodedVersion = encodeURIComponent(JSON.stringify({ path: '' }));
    const addonDocsRootURL = '/';
    const actual = replaceDeployTokens(
      contents,
      addonDocsRootURL,
      encodedVersion,
    );

    // rootURL should stay as / (no change for root deploy)
    assert.include(actual, '%22rootURL%22%3A%22%2F%22');
    // asset paths should stay as /assets/ (no change for root deploy)
    assert.include(actual, 'src="/assets/vendor.js"');
  });

  it('replaceDeployTokens with link href attributes', function () {
    const contents = '<link href="/assets/vendor.css" rel="stylesheet">';
    const encodedVersion = encodeURIComponent(JSON.stringify({ path: '' }));
    const addonDocsRootURL = '/my-addon/';
    const actual = replaceDeployTokens(
      contents,
      addonDocsRootURL,
      encodedVersion,
    );

    assert.include(actual, 'href="/my-addon/assets/vendor.css"');
  });

  it('replaceDeployTokens replaces ADDON_DOCS_DEPLOY_VERSION', function () {
    const contents = '{"deployVersion":"%22ADDON_DOCS_DEPLOY_VERSION%22"}';
    const version = {
      path: 'versions/main',
      name: 'main',
      sha: 'abc',
      tag: null,
      key: 'main',
    };
    const encodedVersion = encodeURIComponent(JSON.stringify(version));
    const actual = replaceDeployTokens(contents, '/', encodedVersion);

    assert.include(actual, encodedVersion);
    assert.notInclude(actual, 'ADDON_DOCS_DEPLOY_VERSION');
  });
});
