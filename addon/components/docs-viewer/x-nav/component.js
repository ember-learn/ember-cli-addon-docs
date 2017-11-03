import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  store: service(),
  docsSearch: service(),

  tagName: 'nav',

  classNames: 'docs-viewer__nav',

  projectVersion: computed(function() {
    return this.get('store').peekAll('project-version').get('firstObject');
  }),

  init() {
    this._super();

    // Start downloading the search index immediately
    this.get('docsSearch').loadSearchIndex();
  },

  search(text) {
    if (text.trim().length) {
      this.get('docsSearch').searchAndLog(text);
    }
  },

  actions: {
    search(text) {
      debounce(this, 'search', text, 250);
    }
  }

  // didInsertElement() {
  //   this._super(...arguments);
  //
  //   this.get('store').findRecord('project', 'ember-cli-mirage')
  //     .then(project => {
  //       let projectVersion = project.get('projectVersions.firstObject.id');
  //       let version = projectVersion.split('ember-cli-mirage-')[1];
  //
  //       this.set('projectVersion.version', version);
  //
  //       return this.get('store').findRecord('project-version', projectVersion);
  //     })
  //     .then(projectVersion => {
  //       this.set('projectVersion', projectVersion);
  //     });
  // }

});
