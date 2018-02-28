import Component from '@ember/component';
import { computed } from '@ember/object';

import layout from './template';

export default Component.extend({
  layout,

  hasContents: computed('class', {
    get() {
      let klass = this.get('class');

      return klass.get('constructors.length') > 0
        || klass.get('fields.length') > 0
        || klass.get('accessors.length') > 0
        || klass.get('methods.length') > 0;
    }
  })
});
