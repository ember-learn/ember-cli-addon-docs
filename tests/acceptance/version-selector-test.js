import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  setupMockVersions,
  mockVersionsEndpoint,
} from '../helpers/mock-versions';
import { visit, click, triggerEvent } from '@ember/test-helpers';

const TRIGGER = '[data-test-id="current-version"]';
const LIST = '[data-test-docs-version-selector]';

let config;

module('Acceptance | Version selector test', function (hooks) {
  setupApplicationTest(hooks);
  setupMockVersions(hooks);

  hooks.beforeEach(async function () {
    config = this.owner.resolveRegistration('config:environment');
  });

  test('if the current version is latest and latest has a tag, it displays the tag', async function (assert) {
    this.owner.lookup('service:project-version').set('currentVersion', {
      sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
      tag: 'v0.1.0',
      path: '',
      key: '-latest',
      name: 'latest',
    });

    await visit('/');

    assert.dom('[data-test-id="current-version"]').includesText('v0.1.0');
  });

  test(`if the current version is latest and latest doesn't have a tag, it displays Latest`, async function (assert) {
    this.owner.lookup('service:project-version').set('currentVersion', {
      sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
      tag: null,
      path: '',
      key: '-latest',
      name: 'latest',
    });

    await visit('/');

    assert.dom('[data-test-id="current-version"]').includesText('Latest');
  });

  test(`the version selector renders correctly`, async function (assert) {
    mockVersionsEndpoint(this.server, {
      '-latest': {
        sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
        tag: null,
        path: '',
        name: 'Latest',
      },
      main: {
        sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
        tag: null,
        path: 'main',
        name: 'main',
      },
      'v0.2.x': {
        sha: 'aca26720d930843dd084b508fce75b158ff0386e',
        tag: 'v0.2.4',
        path: 'versions/v0.2.x',
        name: 'v0.2.x',
      },
      'v0.1.0': {
        sha: 'd752437850bc9833ea3e354095b501473b0420ae',
        tag: 'v0.1.0',
        path: 'v0.1.0',
        name: 'v0.1.0',
      },
      'v0.3.0': {
        sha: '833a8aa00df5918b07d0574a28a0adc41d5ac2e6',
        tag: 'v0.3.0',
        path: 'v0.3.0',
        name: 'v0.3.0',
      },
    });

    await visit('/');
    await click('[data-test-id="current-version"]');

    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('Latest', 'latest is rendered first');
    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('53b73', 'latest renders a sha when tag is null');
    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('check', 'the current version has a check');

    assert
      .dom('[data-test-id="version"]:nth-child(2)')
      .includesText('main', 'main is rendered second');
    assert.dom('[data-test-id="version"]:nth-child(2)').includesText('53b73');

    assert
      .dom('[data-test-id="version"]:nth-child(3)')
      .includesText('v0.3.0', 'tags are rendered last, in desc order');
    assert.dom('[data-test-id="version"]:nth-child(3)').includesText('833a8');

    assert.dom('[data-test-id="version"]:nth-child(4)').includesText('v0.2.x');
    assert.dom('[data-test-id="version"]:nth-child(4)').includesText('aca26');

    assert.dom('[data-test-id="version"]:nth-child(5)').includesText('v0.1.0');
    assert.dom('[data-test-id="version"]:nth-child(5)').includesText('d7524');
  });

  test(`the version selector renders a tag for latest if present`, async function (assert) {
    mockVersionsEndpoint(this.server, {
      '-latest': {
        sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
        tag: 'v0.1.0',
        path: '',
        name: 'Latest',
      },
      main: {
        sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
        tag: null,
        path: 'main',
        name: 'main',
      },
      'v0.1.0': {
        sha: 'd752437850bc9833ea3e354095b501473b0420ae',
        tag: 'v0.1.0',
        path: 'v0.1.0',
        name: 'v0.1.0',
      },
    });

    await visit('/');
    await click('[data-test-id="current-version"]');

    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('Latest', 'latest is rendered first');
    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('v0.1.0', 'latest renders a tag if present');

    await click('[data-test-id="current-version"]'); // close it
    await click('[data-test-id="current-version"]'); // open a scond time

    assert
      .dom('[data-test-id="version"]:nth-child(1)')
      .includesText('Latest', 'latest is rendered on second open');
    assert
      .dom('[data-test-id="version"]:nth-child(2)')
      .includesText('main', 'main is rendered on second open');
  });

  module('popover behaviour', function (hooks) {
    hooks.beforeEach(async function () {
      await visit('/');
      await click(TRIGGER);
    });

    test('it opens in the top layer, right-aligned below the trigger', async function (assert) {
      let list = document.querySelector(LIST);
      assert.ok(list.matches(':popover-open'), 'the list is an open popover');

      let listRect = list.getBoundingClientRect();
      let triggerRect = document.querySelector(TRIGGER).getBoundingClientRect();

      assert.closeTo(
        listRect.right,
        triggerRect.right,
        1,
        'right edges line up',
      );
      assert.closeTo(
        listRect.top,
        triggerRect.bottom + 8,
        1,
        'the list sits 0.5rem below the trigger',
      );
    });

    test('clicking the trigger again closes it', async function (assert) {
      await click(TRIGGER);
      assert.dom(LIST).doesNotExist();
    });

    test('clicking outside closes it', async function (assert) {
      await triggerEvent(document.body, 'pointerdown');
      assert.dom(LIST).doesNotExist();
    });

    test('clicking inside keeps it open', async function (assert) {
      await triggerEvent(`${LIST} li:nth-child(2) a`, 'pointerdown');
      assert.dom(LIST).exists();
    });

    test('Escape closes it', async function (assert) {
      await triggerEvent(document.body, 'keydown', {
        key: 'Escape',
        code: 'Escape',
      });
      assert.dom(LIST).doesNotExist();
    });
  });

  test('a long list of versions scrolls instead of running off the viewport', async function (assert) {
    let versions = {};
    for (let i = 0; i < 60; i++) {
      let name = `v0.${String(99 - i).padStart(2, '0')}.0`;
      versions[name] = {
        sha: String(i).padStart(40, '0'),
        tag: name,
        path: name,
        name,
      };
    }
    mockVersionsEndpoint(this.server, versions);

    await visit('/');
    await click(TRIGGER);

    let list = document.querySelector(LIST);
    let rect = list.getBoundingClientRect();

    assert.dom('[data-test-id="version"]').exists({ count: 60 });
    assert.ok(
      rect.bottom <= window.innerHeight,
      `the list ends inside the viewport (${rect.bottom} <= ${window.innerHeight})`,
    );
    let scroller = list.querySelector('ul');
    assert.ok(
      scroller.scrollHeight > scroller.clientHeight,
      'the list scrolls internally',
    );
  });

  module('with a custom primary branch configured', function (hooks) {
    let oldPrimaryBranch;
    hooks.beforeEach(function () {
      oldPrimaryBranch = config.primaryBranch;
      config['ember-cli-addon-docs'].primaryBranch = 'develop';
    });

    hooks.afterEach(function () {
      config['ember-cli-addon-docs'].primaryBranch = oldPrimaryBranch;
    });

    test(`the version selector honors the primary branch`, async function (assert) {
      mockVersionsEndpoint(this.server, {
        '-latest': {
          sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
          tag: null,
          path: '',
          name: 'Latest',
        },
        main: {
          sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
          tag: null,
          path: 'main',
          name: 'main',
        },
        develop: {
          sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
          tag: null,
          path: 'develop',
          name: 'develop',
        },
      });

      await visit('/');
      await click('[data-test-id="current-version"]');

      assert
        .dom('[data-test-id="version"]:nth-child(1)')
        .includesText('Latest', 'latest is rendered first');
      assert
        .dom('[data-test-id="version"]:nth-child(1)')
        .includesText('53b73', 'latest renders a sha when tag is null');
      assert
        .dom('[data-test-id="version"]:nth-child(1)')
        .includesText('check', 'the current version has a check');

      assert
        .dom('[data-test-id="version"]:nth-child(2)')
        .includesText('develop', 'develop is rendered second');
      assert.dom('[data-test-id="version"]:nth-child(2)').includesText('53b73');

      assert
        .dom('[data-test-id="version"]:nth-child(3)')
        .includesText('main', 'other branches are rendered last');
      assert.dom('[data-test-id="version"]:nth-child(3)').includesText('53b73');
    });
  });
});
