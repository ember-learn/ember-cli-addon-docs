import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  root: 'docs',

  // Currently provided by the calling template
  // while there is no central access to the resource
  project: null
});
