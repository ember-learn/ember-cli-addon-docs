'use strict';

const assert = require('chai').assert;
const {
  replaceAddonDocsRootURL,
} = require('../../../lib/utils/find-and-replace-in-directory');

describe('`deploy` | plugin test', function () {
  it('replaceAddonDocsRootURL in index.html', function () {
    const contents = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2FADDON_DOCS_ROOT_URL%2F%22%7D" />
        </head>
        <body>
          <script src="ADDON_DOCS_ROOT_URL/assets/chunk.805.d0514e7e9edb751c6623.js"></script>
          <script src="ADDON_DOCS_ROOT_URL/assets/chunk.524.385868f2db0b958b5ced.js"></script>
          <script src="/ADDON_DOCS_ROOT_URL/assets/vendor.js"></script>
          <script src="/ADDON_DOCS_ROOT_URL/assets/dummy.js"></script>
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
    const actual = replaceAddonDocsRootURL(
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
  it('replaceAddonDocsRootURL in chunks', function () {
    const chunk =
      '(e.children=[]),e),o.p="ADDON_DOCS_ROOT_URL/assets/",(()=>{var e={143:0}';
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
    const actual = replaceAddonDocsRootURL(
      chunk,
      addonDocsRootURL,
      encodedVersion,
    );
    const expected =
      '(e.children=[]),e),o.p="/my-addon/versions/main/assets/",(()=>{var e={143:0}';
    assert.equal(actual, expected);
  });
});
