import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit } from '@ember/test-helpers';

import modulePage from '../../../pages/api/module';
import classPage from '../../../pages/api/class';

module('Acceptance | API | helpers', function(hooks) {
  setupApplicationTest(hooks);

  module('standard helpers', function() {
    for (let documenter of ['esdoc', 'yuidoc']) {
      let helperName = `${documenter}Helper`;
      let kebabName = `${documenter}-helper`;

      test(`{{${kebabName}}}`, async function(assert) {
        await visit('/sandbox');
        await modulePage.navItems.findOne({ text: `{{${kebabName}}}` }).click();

        assert.equal(currentURL(), `/sandbox/api/helpers/${kebabName}`, 'correct url');

        let functionsSection = modulePage.sections.findOne({ header: 'Functions' });

        assert.ok(functionsSection.isPresent, 'Renders the functions section');

        let helperItem = functionsSection.items.findOne(i => i.header.includes(helperName));

        assert.ok(helperItem.isPresent, 'Renders the helper item');

        assert.equal(
          helperItem.header,
          `${helperName}(number: number): number`,
          'renders the type signature of the helper correctly'
        );

        assert.equal(
          helperItem.importPath,
          `import { ${helperName} } from 'ember-cli-addon-docs/helpers/${kebabName}';`,
          'renders the import path correctly'
        );

        assert.equal(helperItem.params.length, 1, 'renders the item parameter');
      });
    }
  });

  module('class helpers', function() {
    for (let documenter of ['ESDoc', 'YUIDoc']) {
      let helperName = `${documenter}ClassHelper`;
      let kebabName = `${documenter.toLowerCase()}-class-helper`;

      test(`{{${kebabName}}}`, async function(assert) {
        await visit('/sandbox');
        await classPage.navItems.findOne({ text: `{{${kebabName}}}` }).click();

        assert.equal(currentURL(), `/sandbox/api/helpers/${kebabName}`, 'correct url');

        assert.equal(classPage.title, helperName, 'Renders the class title correctly');

        let methodsSection = modulePage.sections.findOne({ header: 'Methods' });

        assert.ok(methodsSection.isPresent, 'Renders the methods section');

        let computeItem = methodsSection.items.findOne(i => i.header.includes('compute'));

        assert.ok(computeItem.isPresent, 'Renders the helper item');

        assert.equal(
          computeItem.header,
          'compute(number: number): number',
          'renders the type signature of the helper correctly'
        );

        assert.equal(computeItem.params.length, 1, 'renders the item parameter');
      });
    }
  });
});


