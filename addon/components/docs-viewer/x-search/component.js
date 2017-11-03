import Ember from 'ember';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, {
  layout,
  classNames: 'docs-viewer-search',

  docsSearch: service(),
  router: service(),

  query: null,
  selectedIndex: null,

  init() {
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

  searchResults: Ember.computed('rawSearchResults.[]', function() {
    let rawSearchResults = this.get('rawSearchResults');

    if (rawSearchResults) {
      let filteredSearchResults = this.get('rawSearchResults')
        .filter(({ document }) => {
          return document.route !== 'not-found';
        })
        .filter(({ document }) => {
          let isClassTemplate = (document.route === 'docs.api.class' && document.type === 'template');
          return !isClassTemplate;
        });

      return filteredSearchResults;
    }
  }),

  gotoSelectedItem: Ember.on(keyUp('Enter'), function() {
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

  nextSearchResult: Ember.on(keyDown('ctrl+KeyN'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let lastResultIsSelected = (this.get('selectedIndex') + 1 === this.get('searchResults.length'));

    if (hasSearchResults && !lastResultIsSelected) {
      this.incrementProperty('selectedIndex');
    }
  }),

  previousSearchResult: Ember.on(keyDown('ctrl+KeyP'), function() {
    let hasSearchResults = this.get('searchResults.length');
    let firstResultIsSelected = (this.get('selectedIndex') === 0);

    if (hasSearchResults && !firstResultIsSelected) {
      this.decrementProperty('selectedIndex');
    }
  }),

  focusSearch: Ember.on(keyUp('Slash'), keyUp('KeyS'), function() {
    this.$('.docs-viewer-search__input').focus();
  }),

  unfocusSearch: Ember.on(keyUp('Escape'), function() {
    this.setProperties({
      rawSearchResults: null,
      didSearch: false
    });
    this.$('.docs-viewer-search__input').blur();
  }),

  clearSearch() {
    this.setProperties({
      didSearch: false,
      selectedIndex: null,
      rawSearchResults: null,
      query: null
    });
    this.$('.docs-viewer-search__input').val('');
    this.$('.docs-viewer-search__input').blur();
  },

  actions: {
    search(text) {
      debounce(this, 'search', text, 250);
    },

    selectResult(index) {
      this.set('selectedIndex', index);
    },

    clearSearch() {
      this.clearSearch();
    },
  }

});
