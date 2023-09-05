import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { keyResponder, onKey } from 'ember-keyboard';
import { restartableTask } from 'ember-concurrency';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

@keyResponder
export default class DocsHeaderSearchResults extends Component {
  @service docsSearch;
  @service router;
  @service store;

  @tracked selectedIndex = null;
  @tracked rawSearchResults = [];

  @addonDocsConfig config;

  constructor() {
    super(...arguments);

    // Start downloading the search index immediately
    this.docsSearch.loadSearchIndex();
  }

  get project() {
    return this.store.peekRecord('project', this.config.projectName);
  }

  get trimmedQuery() {
    return this.args.query.trim();
  }

  @restartableTask
  *search() {
    let results;

    if (this.trimmedQuery) {
      results = yield this.docsSearch.search(this.trimmedQuery);
    }

    this.selectedIndex = results.length ? 0 : null;
    this.rawSearchResults = results;
  }

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
              let navigableModules = this.project.navigationIndex.find(
                (section) => section.type === 'modules',
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
                document.item.id,
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
          selectedResult.model.routingId,
        );
      }
    }

    this.args.onVisit?.();
  }

  @onKey('ctrl+KeyN')
  @onKey('ArrowDown')
  nextSearchResult() {
    let hasSearchResults = this.searchResults.length;
    let lastResultIsSelected =
      this.selectedIndex + 1 === this.searchResults.length;

    if (hasSearchResults && !lastResultIsSelected) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  @onKey('ctrl+KeyP')
  @onKey('ArrowUp')
  previousSearchResult() {
    let hasSearchResults = this.searchResults.length;
    let firstResultIsSelected = this.selectedIndex === 0;

    if (hasSearchResults && !firstResultIsSelected) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  @action
  selectResult(index) {
    this.selectedIndex = index;
  }
}
