import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';

export default Component.extend(EKMixin, {
  layout,
  classNames: 'ml-auto',

  docsSearch: service(),
  router: service(),

  query: null,
  selectedIndex: null,

  didInsertElement() {
    this._super();

    this.set('keyboardActivated', true);

    // Start downloading the search index immediately
    this.get('docsSearch').loadSearchIndex();
  },

  search(text) {
    if (text.trim().length) {
      this.set('query', text);
      this.get('docsSearch').search(text)
        .then(rawSearchResults => {
          this.setProperties({
            rawSearchResults,
            selectedIndex: 0,
            didSearch: true
          });
        });
    } else {
      this.setProperties({
        didSearch: false,
        selectedIndex: null
      });
    }
  },

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

    this.clearSearch();
  }),

  nextSearchResult: on(keyDown('ctrl+KeyN'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let lastResultIsSelected = (this.get('selectedIndex') + 1 === this.get('searchResults.length'));

    if (hasSearchResults && !lastResultIsSelected) {
      this.incrementProperty('selectedIndex');
    }
  }),

  previousSearchResult: on(keyDown('ctrl+KeyP'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let firstResultIsSelected = (this.get('selectedIndex') === 0);

    if (hasSearchResults && !firstResultIsSelected) {
      this.decrementProperty('selectedIndex');
    }
  }),

  focusSearch: on(keyUp('Slash'), keyUp('KeyS'), function() {
    this.element.querySelector('input').focus();
  }),

  unfocusSearch: on(keyUp('Escape'), function() {
    this.setProperties({
      rawSearchResults: null,
      didSearch: false
    });
    this.element.querySelector('input').blur();
  }),

  clearSearch() {
    this.setProperties({
      didSearch: false,
      selectedIndex: null,
      rawSearchResults: null,
      query: null
    });
    let input = this.element.querySelector('input');
    input.value = '';
    input.blur();
  },

  actions: {
    search(text) {
      debounce(this, 'search', text, 100);
    },

    selectResult(index) {
      this.set('selectedIndex', index);
    },

    clearSearch() {
      this.clearSearch();
    },
  }

});
