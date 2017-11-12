import { computed } from '@ember/object';
import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Service.extend({

  router: service('-routing'),

  init() {
    this._super(...arguments);
    this.resetState();
  },

  resetState() {
    this.set('items', A());
  },

  allUrls: computed('items.[]', function() {
    return this.get('items').map(item => {
      let hrefToArgs = [ this, item.route ];
      if (item.model) {
        hrefToArgs.push(item.model);
      }

      return hrefTo.apply(null, hrefToArgs);
    });
  }),

  currentUrl: computed('router.router.currentURL', function() {
    let router = this.get('router.router');
    let currentUrl = router.get('rootURL') + router.get('currentURL');

    return currentUrl
      .replace("//", "/")  // dedup slashes
      .replace(/\/$/, ""); // remove trailing slash
  }),

  previousUrl: computed('allUrls.[]', 'currentUrl', function() {
    let currentIndex = this.get('allUrls').indexOf(this.get('currentUrl'));

    if (currentIndex > 0) {
      return this.get('allUrls')[(currentIndex - 1)];
    }
  }),

  nextUrl: computed('allUrls.[]', 'currentUrl', function() {
    let currentIndex = this.get('allUrls').indexOf(this.get('currentUrl'));

    if (currentIndex < this.get('allUrls.length')) {
      return this.get('allUrls')[(currentIndex + 1)];
    }
  })

});
