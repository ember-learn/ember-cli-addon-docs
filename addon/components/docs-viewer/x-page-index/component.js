import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({

  layout,

  tagName: '',

  pageIndex: service()
});
