import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';

module('Acceptance | API | helpers', function(hooks) {
  setupApplicationTest(hooks);

  for (let documenter of ['esdoc', 'yuidoc']) {
    let helperName = `${documenter}Helper`;
    let kebabName = `${documenter}-helper`;

    test('{{esdoc-helper}}', async function(assert) {
      await visit('/sandbox');
      await modulePage.navItems.findOne({ text: `{{${kebabName}}}` }).click();

      assert.equal(currentURL(), `/sandbox/api/helpers/${kebabName}`, 'correct url');

      let helpersSection = modulePage.sections.findOne({ header: 'Helpers' });

      assert.ok(helpersSection.isPresent, 'Renders the helpers section');

      let helperItem = helpersSection.items.findOne(i => i.header.includes(helperName));

      assert.ok(helperItem.isPresent, 'Renders the helper item');

      assert.equal(
        helperItem.header,
        `${helperName}(number: number): number`,
        'renders the type signature of the helper correctly'
      );

      assert.equal(
        helperItem.importPath,
        `import { ${helperName} } from 'ember-cli-addon-docsapp/helpers/${kebabName}';`,
        'renders the import path correctly'
      );

      assert.equal(helperItem.params.length, 1, 'renders the item parameter');
    });
  }
});


