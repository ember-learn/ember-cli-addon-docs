import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

Route.reopen({
  afterModel() {
    if (typeof location !== 'undefined') {
      const { hash } = location;
      if (hash && hash.length) {
        schedule('afterRender', null, () => {
          const anchor = document.querySelector(`a[href="${hash}"`);
          if (anchor) {
            anchor.scrollIntoView();
          }
        });
      }
    }

    return this._super(...arguments);
  }
});

/**
  @function initialize
  @hide
*/
export function initialize() {}

export default {
  initialize,
};
