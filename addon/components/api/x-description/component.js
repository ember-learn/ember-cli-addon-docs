import Component from '@ember/component';
import { computed } from '@ember/object';

import { createTemplateFactory } from '@ember/template-factory';

import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  item: null,

  htmlbars: computed('item.htmlbars', function() {
    let htmlbars = this.get('item.htmlbars');

    if (htmlbars) {
      return createTemplateFactory(JSON.parse(htmlbars));
    }

    return null;
  }),
}).reopenClass({

  positionalParams: [ 'item' ]

});
