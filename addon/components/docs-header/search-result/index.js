import Component from '@glimmer/component';
import { cached } from 'tracked-toolbox';
import { bool } from '@ember/object/computed';

export default class DocsHeaderSearchResult extends Component {
  get linkArgs() {
    let type = this.args.result.document.type;
    if (type === 'template') {
      return {
        route: this.args.result.document.route,
        models: [],
      };
    } else {
      return {
        route: 'docs.api.item',
        models: [this.args.result.model.routingId],
      };
    }
  }

  get icon() {
    if (this.args.result.document.type === 'template') {
      return 'guide';
    } else {
      return 'api-item';
    }
  }

  @cached
  get matches() {
    let metadata = this.args.result.resultInfo.matchData.metadata;

    return Object.keys(metadata).reduce((matches, term) => {
      let match = metadata[term];
      let query = this.args.query;
      let normalizedQuery = query.toLowerCase();
      Object.keys(match).forEach((key) => {
        if (key === 'text') {
          let text = this.args.result.document.text;
          let spaceIndices = text
            .split('')
            .map((char, index) => (char === ' ' ? index : null))
            .filter((val) => val > 0);

          match.text.position.forEach(([wordStart, length]) => {
            let spaceAfterWord = spaceIndices.find((i) => i > wordStart);
            let indexOfSpaceAfterWord = spaceIndices.indexOf(spaceAfterWord);
            let indexOfSpaceBeforeWord = indexOfSpaceAfterWord - 1;
            let indexOfStartingSpace =
              indexOfSpaceBeforeWord > 3 ? indexOfSpaceBeforeWord - 3 : 0;
            let indexOfEndingSpace =
              indexOfSpaceAfterWord + 3 < spaceIndices.length
                ? indexOfSpaceAfterWord + 3
                : spaceIndices.length;
            let matchingText = text.slice(
              spaceIndices[indexOfStartingSpace],
              spaceIndices[indexOfEndingSpace],
            );
            matchingText = this._highlight(
              matchingText,
              matchingText.indexOf(query),
              query.length,
            );

            matches.push(matchingText);
          });
        } else {
          let normalizedTerm = term.toLowerCase();
          this.args.result.document.keywords.forEach((keyword) => {
            let normalizedKeyword = keyword.toLowerCase();
            if (keyword.toLowerCase().indexOf(normalizedTerm) !== -1) {
              let index = normalizedKeyword.indexOf(normalizedQuery);
              matches.push(
                this._highlight(keyword, index, normalizedQuery.length),
              );
            }
          });
        }
      });

      return matches;
    }, []);
  }

  get bestMatch() {
    // Right now this is arbitrarily returning the first match. Needs more work to find the "best" match on the page.
    return this.matches[0];
  }

  get highlightedTitle() {
    let title = this.args.result.document.title || '';
    let match = title.match(new RegExp(this.args.query, 'i'));

    if (match) {
      let start = match.index;
      let length = this.args.query.length;

      return `${title.slice(
        0,
        start,
      )}<span class='docs-border-b-2 docs-border-brand'>${title.slice(
        start,
        start + length,
      )}</span>${title.slice(start + length)}`;
    }

    return null;
  }

  @bool('highlightedTitle')
  titleMatchesQuery;

  _highlight(text, start, length) {
    return `${text.slice(
      0,
      start,
    )}<span class='docs-border-b-2 docs-border-brand'>${text.slice(
      start,
      start + length,
    )}</span>${text.slice(start + length)}`;
  }
}
