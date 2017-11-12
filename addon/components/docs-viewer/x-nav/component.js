import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'nav',
  classNames: 'docs-viewer__nav',

  store: service(),

  projectVersion: computed(function() {
    return this.get('store').peekAll('project-version').get('firstObject');
  })
});
