import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';
import classPage from '../../../pages/api/class';

module('Acceptance | Sandbox | API | helpers', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('standard helpers', function () {
    for (let documenter of ['yuidoc']) {
      let helperName = `${documenter}Helper`;
      let kebabName = `${documenter}-helper`;

      test(`{{${kebabName}}}`, async function (assert) {
        await visit('/sandbox');
        await modulePage.navItems.findOne({ text: `{{${kebabName}}}` }).click();

        assert.strictEqual(
          currentURL(),
          `/sandbox/api/helpers/${kebabName}`,
          'correct url',
        );

        let functionsSection = modulePage.sections.findOne({
          header: 'Functions',
        });

        assert.ok(functionsSection.isPresent, 'Renders the functions section');

        let helperItem = functionsSection.items.findOne((i) =>
          i.header.includes(helperName),
        );

        assert.ok(helperItem.isPresent, 'Renders the helper item');

        assert.strictEqual(
          helperItem.header,
          `${helperName}(number: number): number`,
          'renders the type signature of the helper correctly',
        );

        assert.strictEqual(
          helperItem.importPath,
          `import { ${helperName} } from 'sandbox/helpers/${kebabName}';`,
          'renders the import path correctly',
        );

        assert.strictEqual(
          helperItem.params.length,
          1,
          'renders the item parameter',
        );
      });
    }
  });

  module('class helpers', function () {
    for (let documenter of ['YUIDoc']) {
      let helperName = `${documenter}ClassHelper`;
      let kebabName = `${documenter.toLowerCase()}-class-helper`;

      test(`{{${kebabName}}}`, async function (assert) {
        await visit('/sandbox');
        await classPage.navItems.findOne({ text: `{{${kebabName}}}` }).click();

        assert.strictEqual(
          currentURL(),
          `/sandbox/api/helpers/${kebabName}`,
          'correct url',
        );

        assert.strictEqual(
          classPage.title,
          helperName,
          'Renders the class title correctly',
        );

        let methodsSection = modulePage.sections.findOne({ header: 'Methods' });

        assert.ok(methodsSection.isPresent, 'Renders the methods section');

        let computeItem = methodsSection.items.findOne((i) =>
          i.header.includes('compute'),
        );

        assert.ok(computeItem.isPresent, 'Renders the helper item');

        assert.strictEqual(
          computeItem.header,
          'compute(number: number): number',
          'renders the type signature of the helper correctly',
        );

        assert.strictEqual(
          computeItem.params.length,
          1,
          'renders the item parameter',
        );
      });
    }
  });
});
