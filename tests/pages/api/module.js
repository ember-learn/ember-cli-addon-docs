import BaseAddonPage from '../base';
import { collection, text } from 'ember-classy-page-object';

const ModulePage = BaseAddonPage.extend({
  navItems: collection({ scope: '[data-test-id="nav-item"]' }),

  toggles: collection({
    scope: '[data-test-toggle]'
  }),

  sections: collection({
    scope: '[data-test-api-section]',

    header: text('[data-test-section-header]'),

    items: collection({
      scope: '[data-test-item]',

      header: text('[data-test-item-header]'),
      importPath: text('[data-test-import-path]'),
      description: text('[data-test-item-description]'),

      params: collection({
        scope: '[data-test-item-params] [data-test-item-param]'
      })
    })
  }),

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  index: {
    scope: '[data-test-page-index]',

    items: collection({
      scope: '[data-test-index-item]'
    })
  }
});

export default ModulePage.create();
