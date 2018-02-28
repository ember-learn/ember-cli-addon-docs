import Component from '@ember/component';
import { computed } from '@ember/object';

import layout from './template';

export default Component.extend({
  layout,

  hasContents: computed('component', {
    get() {
      let component = this.get('component');

      return component.get('constructors.length') > 0
        || component.get('yields.length') > 0
        || component.get('arguments.length') > 0
        || component.get('fields.length') > 0
        || component.get('accessors.length') > 0
        || component.get('methods.length') > 0;
    }
  })
});
