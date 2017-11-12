import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  result: null,
  'on-click'() {},
  'on-mouse-enter'() {},

  linkArgs: computed('result.document', function() {
    let args = [];
    let type = this.get('result.document.type');
    if (type === 'template') {
      args = [ this.get('result.document.route') ];
    } else if (type === 'class') {
      args = [ 'docs.api.class', this.get('result.document.class.id') ];
    }

    return args;
  }),

  click() {
    this.get('on-click')();
  },
  mouseEnter() {
    this.get('on-mouse-enter')();
  },

  icon: computed(function() {
    if (this.get('result.document.type') === 'template') {
      return 'guide';
    } else {
      return 'class';
    }
  }),

  matches: computed(function() {
    let metadata = this.get('result.resultInfo.matchData.metadata');

    return Object.keys(metadata).reduce((matches, key) => {
      let match = metadata[key];
      if (match.text) {
        let text = this.get('result.document.text');
        let spaceIndices = text.split("")
          .map((char, index) => (char === ' ') ? index : null)
          .filter(val => val > 0);

        match.text.position.forEach(([ wordStart, length ]) => {
          let spaceAfterWord = spaceIndices.find(i => i > wordStart);
          let indexOfSpaceAfterWord = spaceIndices.indexOf(spaceAfterWord);
          let indexOfSpaceBeforeWord = indexOfSpaceAfterWord - 1;
          let indexOfStartingSpace = (indexOfSpaceBeforeWord > 3) ? indexOfSpaceBeforeWord - 3 : 0;
          let indexOfEndingSpace = ((indexOfSpaceAfterWord + 3) < spaceIndices.length) ? indexOfSpaceAfterWord + 3 : spaceIndices.length;
          let matchingText = text.slice(spaceIndices[indexOfStartingSpace], spaceIndices[indexOfEndingSpace]);
          let query = this.get('query');
          matchingText = matchingText.replace(query, `<em class='docs-viewer-search__result-item__text--emphasis'>${query}</em>`);

          matches.push(matchingText);
        });
      }

      return matches;
    }, []).join(' &middot ');
  })
});
