import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend(EKMixin, {
  layout,

  docsSearch: service(),
  router: service(),

  query: null, // passed in
  selectedIndex: null,

  didInsertElement() {
    this._super();

    this.set('keyboardActivated', true);

    // Start downloading the search index immediately
    this.get('docsSearch').loadSearchIndex();
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.get('search').perform();
  },

  trimmedQuery: computed('query', function() {
    return this.get('query').trim();
  }),

  search: task(function*() {
    let results;

    if (this.get('trimmedQuery')) {
      results = yield this.get('docsSearch').search(this.get('trimmedQuery'));
    }

    this.set('selectedIndex', (results.length ? 0 : null));
    this.set('rawSearchResults', results);
  }).restartable(),

  searchResults: computed('rawSearchResults.[]', function() {
    let rawSearchResults = this.get('rawSearchResults');
    let router = this.get('router');
    let routerMicrolib = router._router._routerMicrolib || router._router.router;

    if (rawSearchResults) {
      let filteredSearchResults = this.get('rawSearchResults')
        .filter(({ document }) => {
          let routeExists = routerMicrolib.recognizer.names[document.route];
          return routeExists && document.route !== 'not-found';
        })
        .filter(({ document }) => {
          let isClassTemplate = (document.route === 'docs.api.class' && document.type === 'template');
          return !isClassTemplate;
        });

      return filteredSearchResults;
    }
  }),

  gotoSelectedItem: on(keyUp('Enter'), function() {
    if (this.get('selectedIndex') !== null) {
      let selectedResult = this.get('searchResults')[this.get('selectedIndex')];
      if (selectedResult.document.type === 'template') {
        this.get('router').transitionTo(selectedResult.document.route);
      } else if (selectedResult.document.type === 'class') {
        this.get('router').transitionTo('docs.api.class', selectedResult.document.class.id);
      }
    }

    this.get('on-visit')();
  }),

  nextSearchResult: on(keyDown('ctrl+KeyN'), keyDown('ArrowDown'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let lastResultIsSelected = (this.get('selectedIndex') + 1 === this.get('searchResults.length'));

    if (hasSearchResults && !lastResultIsSelected) {
      this.incrementProperty('selectedIndex');
    }
  }),

  previousSearchResult: on(keyDown('ctrl+KeyP'), keyDown('ArrowUp'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let firstResultIsSelected = (this.get('selectedIndex') === 0);

    if (hasSearchResults && !firstResultIsSelected) {
      this.decrementProperty('selectedIndex');
    }
  }),

  clearSearch() {
    this.set('query', null);
  },

  actions: {
    selectResult(index) {
      this.set('selectedIndex', index);
    },

    clearSearch() {
      this.clearSearch();
    },
  }

});
