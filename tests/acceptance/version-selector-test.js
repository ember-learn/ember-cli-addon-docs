import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit, click } from '@ember/test-helpers';
import config from 'dummy/config/environment';

module('Acceptance | Version selector test', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('if the current version is latest and latest has a tag, it displays the tag', async function(assert) {
    this.owner.lookup('service:project-version').set('currentVersion', {
      "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
      "tag": 'v0.1.0',
      "path": "",
      "key": "-latest",
      "name": "latest"
    });

    await visit('/');

    assert.dom('[data-test-id="current-version"]').includesText('v0.1.0');
  });

  test(`if the current version is latest and latest doesn't have a tag, it displays Latest`, async function(assert) {
    this.owner.lookup('service:project-version').set('currentVersion', {
      "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
      "tag": null,
      "path": "",
      "key": "-latest",
      "name": "latest"
    });

    await visit('/');

    assert.dom('[data-test-id="current-version"]').includesText('Latest');
  });

  test(`the version selector renders correctly`, async function(assert) {
    server.get('/versions.json', {
      "-latest": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": null,
        "path": "",
        "name": "Latest"
      },
      "master": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": null,
        "path": "master",
        "name": "master"
      },
      "v0.1.0": {
        "sha": "d752437850bc9833ea3e354095b501473b0420ae",
        "tag": "v0.1.0",
        "path": "v0.1.0",
        "name": "v0.1.0"
      }
    });

    await visit('/');
    await click('[data-test-id="current-version"]');

    assert.dom('[data-test-id="version"]:nth-child(1)').includesText('Latest', 'latest is rendered first');
    assert.dom('[data-test-id="version"]:nth-child(1)').includesText('53b73', 'latest renders a sha when tag is null');
    assert.dom('[data-test-id="version"]:nth-child(1)').includesText('check', 'the current version has a check');

    assert.dom('[data-test-id="version"]:nth-child(2)').includesText('master', 'master is rendered secon');
    assert.dom('[data-test-id="version"]:nth-child(2)').includesText('53b73');

    assert.dom('[data-test-id="version"]:nth-child(3)').includesText('v0.1.0', 'tags are rendered last');
    assert.dom('[data-test-id="version"]:nth-child(3)').includesText('d7524');
  });

  test(`the version selector renders a tag for latest if present`, async function(assert) {
    server.get('/versions.json', {
      "-latest": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": 'v0.1.0',
        "path": "",
        "name": "Latest"
      },
      "master": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": null,
        "path": "master",
        "name": "master"
      },
      "v0.1.0": {
        "sha": "d752437850bc9833ea3e354095b501473b0420ae",
        "tag": "v0.1.0",
        "path": "v0.1.0",
        "name": "v0.1.0"
      }
    });

    await visit('/');
    await click('[data-test-id="current-version"]');

    assert.dom('[data-test-id="version"]:nth-child(1)').includesText('Latest', 'latest is rendered first');
    assert.dom('[data-test-id="version"]:nth-child(1)').includesText('v0.1.0', 'latest renders a tag if present');
  });

  module('with a custom primary branch configured', function(hooks) {
    let oldPrimaryBranch;
    hooks.beforeEach(function() {
      oldPrimaryBranch = config.primaryBranch;
      config.primaryBranch = 'develop';
    });

    hooks.afterEach(function() {
      config.primaryBranch = oldPrimaryBranch;
    });

    test(`the version selector honors the primary branch`, async function(assert) {
      server.get('/versions.json', {
        "-latest": {
          "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
          "tag": null,
          "path": "",
          "name": "Latest"
        },
        "master": {
          "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
          "tag": null,
          "path": "master",
          "name": "master"
        },
        "develop": {
          "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
          "tag": null,
          "path": "develop",
          "name": "develop"
        }
      });

      await visit('/');
      await click('[data-test-id="current-version"]');

      assert.dom('[data-test-id="version"]:nth-child(1)').includesText('Latest', 'latest is rendered first');
      assert.dom('[data-test-id="version"]:nth-child(1)').includesText('53b73', 'latest renders a sha when tag is null');
      assert.dom('[data-test-id="version"]:nth-child(1)').includesText('check', 'the current version has a check');

      assert.dom('[data-test-id="version"]:nth-child(2)').includesText('develop', 'develop is rendered second');
      assert.dom('[data-test-id="version"]:nth-child(2)').includesText('53b73');

      assert.dom('[data-test-id="version"]:nth-child(3)').includesText('master', 'other branches are rendered last');
      assert.dom('[data-test-id="version"]:nth-child(3)').includesText('53b73');
    });
  })
});
