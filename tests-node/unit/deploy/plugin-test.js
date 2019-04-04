'use strict';

const assert = require('chai').assert;
const AddonDocsDeployPlugin = require('../../../lib/deploy/plugin');

describe('`deploy` | plugin test', function() {
  beforeEach(function() {
    this.pluginInstance = new AddonDocsDeployPlugin();
  });

  it('_macroReplaceIndexContent', function() {
    const contents = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2FADDON_DOCS_ROOT_URL%2F%22%7D" />
        </head>
        <body>
          <script src="/ADDON_DOCS_ROOT_URL/assets/vendor.js"></script>
          <script src="/ADDON_DOCS_ROOT_URL/assets/dummy.js"></script>
        </body>
      </html>
    `;
    const encodedVersion = encodeURIComponent(JSON.stringify({
      path: 'versions/master',
      name: 'master',
      sha: 'eef3',
      tag: null,
      key: 'master'
    }));
    const addonDocsRootURL = '/my-addon/versions/master/'
    const actual = this.pluginInstance._macroReplaceIndexContent(contents, addonDocsRootURL, encodedVersion);
    const expected = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="dummy/config/environment" content="%7B%22rootURL%22%3A%22%2Fmy-addon%2Fversions%2Fmaster%2F%22%7D" />
        </head>
        <body>
          <script src="/my-addon/versions/master/assets/vendor.js"></script>
          <script src="/my-addon/versions/master/assets/dummy.js"></script>
        </body>
      </html>
    `;

    assert.equal(actual, expected);
  });
});
