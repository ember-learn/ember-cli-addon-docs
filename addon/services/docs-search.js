import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import $ from 'jquery';
import lunr from 'lunr';

export default Service.extend({
  search(phrase, { exact = false } = {}) {
    if (!exact) {
      phrase = `*${phrase}*`;
    }

    return this.loadSearchIndex()
      .then(({ index, documents }) => {
        return index.search(phrase).map(resultInfo => {
          let document = documents[resultInfo.ref];
          return { resultInfo, document };
        });
      });
  },

  loadSearchIndex() {
    if (!this._searchIndex) {
      this._searchIndex = $.get(this.get('_indexURL'))
        .then(json => {
          return {
            index: lunr.Index.load(json.index),
            documents: json.documents
          };
        });
    }

    return this._searchIndex;
  },

  _indexURL: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment');
    return `${config.rootURL}ember-cli-addon-docs/search-index.json`;
  })
});
