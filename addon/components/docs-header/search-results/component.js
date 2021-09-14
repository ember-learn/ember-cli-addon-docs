import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action } from '@ember/object';
import template from './template';
import { keyResponder, onKey } from 'ember-keyboard';
import { layout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';
@keyResponder
@layout(template)
export default class DocsHeaderSearchResultsComponent extends Component {
  @service docsSearch;
  @service router;
  @service store;

  query = null; // passed in
  selectedIndex = null;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectName } = config;

    this.set('projectName', projectName);
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    // Start downloading the search index immediately
    this.docsSearch.loadSearchIndex();
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    this.search.perform();
  }

  get project() {
    return this.store.peekRecord('project', this.projectName);
  }

  @computed('query')
  get trimmedQuery() {
    return this.query.trim();
  }

  @task({ restartable: true })
  *search() {
    let results;

    if (this.trimmedQuery) {
      results = yield this.docsSearch.search(this.trimmedQuery);
    }

    this.set('selectedIndex', results.length ? 0 : null);
    this.set('rawSearchResults', results);
  }

  @computed('project.navigationIndex', 'rawSearchResults.[]')
  get searchResults() {
    let rawSearchResults = this.rawSearchResults;
    let router = this.router;
    let routerMicrolib =
      router._router._routerMicrolib || router._router.router;

    if (rawSearchResults) {
      return (
        this.rawSearchResults
          // If the doc has a route, ensure it exists
          .filter(({ document }) => {
            if (document.route) {
              let routeExists = routerMicrolib.recognizer.names[document.route];

              return (
                routeExists &&
                document.route !== 'not-found' &&
                document.route !== 'application'
              );
            } else {
              return true;
            }
          })

          // Filter out the templates of the API items' pages, since we handle them separately
          .filter(({ document }) => {
            let isApiItemTemplate =
              document.route === 'docs.api.item' &&
              document.type === 'template';
            return !isApiItemTemplate;
          })

          // Filter out modules that are not in the navigationIndex
          .filter(({ document }) => {
            if (document.type === 'module') {
              let navigableModules = this.get('project.navigationIndex').find(
                (section) => section.type === 'modules'
              );
              let navigableModuleIds = navigableModules
                ? navigableModules.items.map((item) => item.id)
                : [];

              return navigableModuleIds.includes(document.title);
            } else {
              return true;
            }
          })

          // Add a reference to the Ember Data model to each API item search result
          .map((searchResult) => {
            let { document } = searchResult;
            if (document.type !== 'template') {
              let store = this.store;
              searchResult.model = store.peekRecord(
                document.type,
                document.item.id
              );
            }

            return searchResult;
          })
      );
    }

    return undefined;
  }

  @onKey('Enter', { event: 'keyup' })
  gotoSelectedItem() {
    if (this.selectedIndex !== null) {
      let selectedResult = this.searchResults[this.selectedIndex];
      if (selectedResult.document.type === 'template') {
        this.router.transitionTo(selectedResult.document.route);
      } else {
        this.router.transitionTo(
          'docs.api.item',
          selectedResult.model.get('routingId')
        );
      }
    }

    this.get('on-visit')();
  }

  @onKey('ctrl+KeyN')
  @onKey('ArrowDown')
  nextSearchResult() {
    let hasSearchResults = this.get('searchResults.length');
    let lastResultIsSelected =
      this.selectedIndex + 1 === this.get('searchResults.length');

    if (hasSearchResults && !lastResultIsSelected) {
      this.incrementProperty('selectedIndex');
    }
  }

  @onKey('ctrl+KeyP')
  @onKey('ArrowUp')
  previousSearchResult() {
    let hasSearchResults = this.get('searchResults.length');
    let firstResultIsSelected = this.selectedIndex === 0;

    if (hasSearchResults && !firstResultIsSelected) {
      this.decrementProperty('selectedIndex');
    }
  }

  @action
  clearSearch() {
    this.set('query', null);
  }

  @action
  selectResult(index) {
    this.set('selectedIndex', index);
  }
}
