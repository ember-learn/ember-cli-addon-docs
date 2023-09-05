import Service from '@ember/service';
import lunr from 'lunr';
import fetch from 'fetch';
import { enqueueTask } from 'ember-concurrency';
import {
  getAddonDocsConfig,
  getRootURL,
} from 'ember-cli-addon-docs/-private/config';

const { Index, Query } = lunr;

export default class DocsSearch extends Service {
  async search(phrase) {
    const { searchTokenSeparator } = getAddonDocsConfig(this);
    let { index, documents } = await this.loadSearchIndex();
    let words = phrase.toLowerCase().split(new RegExp(searchTokenSeparator));
    let results = index.query((query) => {
      // In the future we could boost results based on the field they come from
      for (let word of words) {
        query.term(index.pipeline.runString(word)[0], {
          wildcard: Query.wildcard.LEADING | Query.wildcard.TRAILING,
        });
      }
    });

    return results.map((resultInfo) => {
      let document = documents[resultInfo.ref];
      return { resultInfo, document };
    });
  }

  // temporary; just useful for tuning search config for now
  searchAndLog(phrase) {
    /* eslint-disable no-console */
    this.search(phrase).then((results) => {
      console.group(`Search For '${phrase}'`);
      for (let result of results) {
        let doc = result.document;
        if (doc.type === 'class') {
          console.groupCollapsed(
            `Class: %c${doc.title}`,
            'font-family: monospace',
          );
          for (let [term, match] of Object.entries(
            result.resultInfo.matchData.metadata,
          )) {
            for (let [key, data] of Object.entries(match)) {
              if (key === 'keywords') {
                let test = term.toLowerCase();
                for (let keyword of doc.keywords) {
                  if (keyword.toLowerCase().indexOf(test) !== -1) {
                    console.log(
                      `%c${keyword} %c(field)`,
                      'font-family: monospace; font-weight: bold',
                      'font-family: inherit; font-weight: normal',
                    );
                  }
                }
              } else {
                for (let position of data.position) {
                  logSnippet(doc, key, position);
                }
              }
            }
          }
          console.groupEnd();
        } else if (doc.type === 'template') {
          console.groupCollapsed(
            `Route: %c${doc.route}`,
            'font-family: monospace',
          );
          for (let match of Object.values(
            result.resultInfo.matchData.metadata,
          )) {
            for (let [key, data] of Object.entries(match)) {
              for (let position of data.position) {
                logSnippet(doc, key, position);
              }
            }
          }
          console.groupEnd();
        }
      }
      console.groupEnd();
    });
    /* eslint-enable no-console */
  }

  loadSearchIndex() {
    return this._loadSearchIndex.perform();
  }

  @enqueueTask
  *_loadSearchIndex() {
    if (!this._searchIndex) {
      let response = yield fetch(this._indexURL);
      let json = yield response.json();

      this._searchIndex = {
        index: Index.load(json.index),
        documents: json.documents,
      };
    }

    return this._searchIndex;
  }

  get _indexURL() {
    return `${getRootURL(this)}ember-cli-addon-docs/search-index.json`;
  }
}

function logSnippet(doc, key, position) {
  let field = doc[key];
  if (!field) {
    return;
  }

  let start = Math.max(position[0] - 15, 0);
  let end = Math.min(position[0] + position[1] + 15, field.length);
  let pre = `${start === 0 ? '' : '...'}${field.slice(start, position[0])}`;
  let snippet = field.slice(position[0], position[0] + position[1]);
  let post = `${field.slice(position[0] + position[1], end)}${
    end === field.length ? '' : '...'
  }`;
  /* eslint-disable no-console */
  console.log(
    `${pre}%c${snippet}%c${post} (${key})`,
    'font-weight: bold',
    'font-weight: regular',
  );
  /* eslint-enable no-console */
}
