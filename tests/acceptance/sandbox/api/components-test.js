import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';

module('Acceptance | Sandbox | API | components', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('nested components work', async function (assert) {
    await visit('/sandbox');
    await modulePage.navItems.findOne({ text: '<SimpleList/\u200B>' }).click();

    assert.strictEqual(
      currentURL(),
      '/sandbox/api/components/simple-list',
      'correct url',
    );

    await modulePage.navItems
      .findOne({ text: '<SimpleList::Item/\u200B>' })
      .click();

    assert.strictEqual(
      currentURL(),
      '/sandbox/api/components/simple-list/item',
      'correct url',
    );
  });

  test("welcome page 'Edit this page' link is correct", async function (assert) {
    await visit('/sandbox');

    const editThisPageLinkHref = await modulePage.editLink.href;

    assert.strictEqual(
      editThisPageLinkHref,
      'https://github.com/ember-learn/ember-cli-addon-docs/edit/master/tests/dummy/app/pods/sandbox/index/template.md',
    );
  });

  module('in a nested directory within a repo', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ].docsAppPathInRepo = 'packages/foo-bar/tests/dummy/app';
    });

    hooks.afterEach(function () {
      this.owner.resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ].docsAppPathInRepo = '';
    });

    test("welcome page 'Edit this page' link is correct", async function (assert) {
      await visit('/sandbox');

      const editThisPageLinkHref = await modulePage.editLink.href;

      assert.strictEqual(
        editThisPageLinkHref,
        'https://github.com/ember-learn/ember-cli-addon-docs/edit/master/packages/foo-bar/tests/dummy/app/pods/sandbox/index/template.md',
      );
    });
  });
});
