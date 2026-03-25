'use strict';

const assert = require('chai').assert;
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const premberUrls = require('../../lib/prember-urls');

describe('Unit | prember-urls', function () {
  let tmpDir;

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prember-urls-'));
  });

  afterEach(function () {
    fs.removeSync(tmpDir);
  });

  it('returns ["/"] when distDir has no docs or search index', function () {
    let urls = premberUrls({ distDir: tmpDir });
    assert.deepEqual(urls, ['/']);
  });

  it('discovers API pages from docs JSON navigationIndex', function () {
    fs.ensureDirSync(path.join(tmpDir, 'docs'));
    fs.writeJsonSync(path.join(tmpDir, 'docs', 'my-addon.json'), {
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: {
          navigationIndex: [
            {
              type: 'components',
              items: [
                { id: 'my-addon/components/foo', path: 'components/foo' },
                {
                  id: 'my-addon/components/bar',
                  path: 'components/bar',
                },
              ],
            },
            {
              type: 'helpers',
              items: [
                {
                  id: 'my-addon/helpers/baz',
                  path: 'helpers/baz',
                },
              ],
            },
          ],
        },
      },
    });

    let urls = premberUrls({ distDir: tmpDir });
    assert.include(urls, '/');
    assert.include(urls, '/docs');
    assert.include(urls, '/docs/api/components/foo');
    assert.include(urls, '/docs/api/components/bar');
    assert.include(urls, '/docs/api/helpers/baz');
  });

  it('discovers template pages from search index', function () {
    fs.ensureDirSync(path.join(tmpDir, 'ember-cli-addon-docs'));
    fs.writeJsonSync(
      path.join(tmpDir, 'ember-cli-addon-docs', 'search-index.json'),
      {
        index: {},
        documents: {
          'template:docs.quickstart': {
            type: 'template',
            route: 'docs.quickstart',
            title: 'Quickstart',
          },
          'template:docs.usage': {
            type: 'template',
            route: 'docs.usage',
            title: 'Usage',
          },
          'template:docs.components.index': {
            type: 'template',
            route: 'docs.components.index',
            title: 'Components',
          },
        },
      },
    );

    let urls = premberUrls({ distDir: tmpDir });
    assert.include(urls, '/docs/quickstart');
    assert.include(urls, '/docs/usage');
    // docs.components.index should become /docs/components (strip trailing /index)
    assert.include(urls, '/docs/components');
    assert.notInclude(urls, '/docs/components/index');
  });

  it('strips trailing /index from routes', function () {
    fs.ensureDirSync(path.join(tmpDir, 'ember-cli-addon-docs'));
    fs.writeJsonSync(
      path.join(tmpDir, 'ember-cli-addon-docs', 'search-index.json'),
      {
        index: {},
        documents: {
          'template:docs.index': {
            type: 'template',
            route: 'docs.index',
          },
          'template:sandbox.docs.index': {
            type: 'template',
            route: 'sandbox.docs.index',
          },
          'template:index': {
            type: 'template',
            route: 'index',
          },
        },
      },
    );

    let urls = premberUrls({ distDir: tmpDir });
    assert.include(urls, '/docs');
    assert.include(urls, '/sandbox/docs');
    assert.include(urls, '/');
    assert.notInclude(urls, '/docs/index');
    assert.notInclude(urls, '/sandbox/docs/index');
    assert.notInclude(urls, '/index');
  });

  it('filters out internal routes from search index', function () {
    fs.ensureDirSync(path.join(tmpDir, 'ember-cli-addon-docs'));
    fs.writeJsonSync(
      path.join(tmpDir, 'ember-cli-addon-docs', 'search-index.json'),
      {
        index: {},
        documents: {
          'template:application': {
            type: 'template',
            route: 'application',
          },
          'template:not-found': {
            type: 'template',
            route: 'not-found',
          },
          'template:templates.docs.foo': {
            type: 'template',
            route: 'templates.docs.foo',
          },
          'template:pods.sandbox.template': {
            type: 'template',
            route: 'pods.sandbox.template',
          },
          'template:docs.quickstart': {
            type: 'template',
            route: 'docs.quickstart',
          },
        },
      },
    );

    let urls = premberUrls({ distDir: tmpDir });
    assert.include(urls, '/docs/quickstart');
    assert.notInclude(urls, '/application');
    assert.notInclude(urls, '/not-found');
    assert.notInclude(urls, '/templates/docs/foo');
    assert.notInclude(urls, '/pods/sandbox/template');
  });

  it('skips non-template documents in search index', function () {
    fs.ensureDirSync(path.join(tmpDir, 'ember-cli-addon-docs'));
    fs.writeJsonSync(
      path.join(tmpDir, 'ember-cli-addon-docs', 'search-index.json'),
      {
        index: {},
        documents: {
          'component:my-addon/components/foo': {
            type: 'component',
            title: 'Foo',
          },
          'module:my-addon/utils/bar': {
            type: 'module',
            title: 'bar',
          },
        },
      },
    );

    let urls = premberUrls({ distDir: tmpDir });
    assert.deepEqual(urls, ['/']);
  });

  it('only generates /docs/api/ URLs for the first project when multiple exist', function () {
    fs.ensureDirSync(path.join(tmpDir, 'docs'));

    fs.writeJsonSync(path.join(tmpDir, 'docs', 'main-addon.json'), {
      data: {
        id: 'main-addon',
        type: 'project',
        attributes: {
          navigationIndex: [
            {
              type: 'components',
              items: [{ id: 'main/foo', path: 'components/foo' }],
            },
          ],
        },
      },
    });

    fs.writeJsonSync(path.join(tmpDir, 'docs', 'sandbox.json'), {
      data: {
        id: 'sandbox',
        type: 'project',
        attributes: {
          navigationIndex: [
            {
              type: 'components',
              items: [{ id: 'sandbox/bar', path: 'components/bar' }],
            },
          ],
        },
      },
    });

    let urls = premberUrls({ distDir: tmpDir });
    assert.include(urls, '/docs/api/components/foo');
    // sandbox URLs should not be generated as /docs/api/
    assert.notInclude(urls, '/docs/api/components/bar');
  });

  it('deduplicates URLs', function () {
    fs.ensureDirSync(path.join(tmpDir, 'docs'));
    fs.ensureDirSync(path.join(tmpDir, 'ember-cli-addon-docs'));

    fs.writeJsonSync(path.join(tmpDir, 'docs', 'my-addon.json'), {
      data: {
        id: 'my-addon',
        type: 'project',
        attributes: { navigationIndex: [] },
      },
    });

    fs.writeJsonSync(
      path.join(tmpDir, 'ember-cli-addon-docs', 'search-index.json'),
      {
        index: {},
        documents: {
          'template:docs.index': {
            type: 'template',
            route: 'docs.index',
          },
        },
      },
    );

    let urls = premberUrls({ distDir: tmpDir });
    let docsCount = urls.filter((u) => u === '/docs').length;
    // Both the docs JSON and the search index contribute '/docs', but the URL
    // itself should only appear once after deduplication.
    assert.equal(docsCount, 1);
    assert.notInclude(urls, '/docs/index');
  });
});
