import PageObject, { collection, text } from 'ember-classy-page-object';

const ClassPage = PageObject.extend({
  navItems: collection({ scope: '[data-test-id="nav-item"]' }),

  title: text('[data-test-class-name]'),
  description: text('[data-test-class-description]'),

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
  })
});

export default ClassPage.create();
