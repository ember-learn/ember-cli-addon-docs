import PageObject, { collection, fillable } from 'ember-classy-page-object';

const DefaultPage = PageObject.extend({
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  fillInSearchQuery: fillable('[data-test-search-box-input]'),
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  searchResults: {
    scope: '[data-test-search-result-list]',
    items: collection({
      scope: '[data-test-search-result]'
    })
  }
});

export default DefaultPage;
