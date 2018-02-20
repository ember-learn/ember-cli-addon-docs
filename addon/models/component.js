import DS from 'ember-data';
import Class from './class';
import { computed } from '@ember/object';

const { attr } = DS;

export default Class.extend({
  yields: attr(),
  arguments: attr(),

  componentTag: computed('file', {
    get() {
      let pathSegments = this.get('file').replace(/\.js$|\.ts$/, '').split('/');

      let fileName = pathSegments.pop();

      if (fileName === 'component') {
        // it's a pod, return the previous segment
        fileName = pathSegments.pop();
      }

      return `{{${fileName}}}`;
    }
  })
});
