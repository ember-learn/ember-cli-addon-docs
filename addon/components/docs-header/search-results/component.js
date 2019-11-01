import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

const projectName = config['ember-cli-addon-docs'].projectName;

export default Component.extend(EKMixin, {
  layout,

  docsSearch: service(),
  router: service(),
  store: service(),

  query: null, // passed in
  selectedIndex: null,

  keyboardActivated: true,

  didInsertElement() {
    this._super();

    // Start downloading the search index immediately
    this.get('docsSearch').loadSearchIndex();
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.get('search').perform();
  },

  project: computed(function() {
    return this.get('store').peekRecord('project', projectName);
  }),

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
      return this.get('rawSearchResults')
        // If the doc has a route, ensure it exists
        .filter(({ document }) => {
          if (document.route) {
            let routeExists = routerMicrolib.recognizer.names[document.route];

            return routeExists && document.route !== 'not-found' && document.route !== 'application';
          } else {
            return true;
          }
        })

        // Filter out the templates of the API items' pages, since we handle them separately
        .filter(({ document }) => {
          let isApiItemTemplate = (document.route === 'docs.api.item' && document.type === 'template');
          return !isApiItemTemplate;
        })

        // Filter out modules that are not in the navigationIndex
        .filter(({ document }) => {
          if (document.type === 'module') {
            let navigableModules = this.get('project.navigationIndex').find(section => section.type === 'modules');
            let navigableModuleIds = navigableModules ? navigableModules.items.map(item => item.id) : [];

            return navigableModuleIds.includes(document.title);
          } else {
            return true;
          }
        })

        // Add a reference to the Ember Data model to each API item search result
        .map(searchResult => {
          let { document } = searchResult;
          if (document.type !== 'template') {
            let store = this.get('store');
            searchResult.model = store.peekRecord(document.type, document.item.id)
          }

          return searchResult;
        });
    }
  }),

  gotoSelectedItem: on(keyUp('Enter'), function() {
    if (this.get('selectedIndex') !== null) {
      let selectedResult = this.get('searchResults')[this.get('selectedIndex')];
      if (selectedResult.document.type === 'template') {
        this.get('router').transitionTo(selectedResult.document.route);
      } else {
        this.get('router').transitionTo('docs.api.item', selectedResult.model.get('routingId'));
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
