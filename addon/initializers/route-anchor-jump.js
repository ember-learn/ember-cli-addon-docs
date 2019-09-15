import Route from '@ember/routing/route';
import { scheduleOnce } from '@ember/runloop';

export function initialize() {
  Route.reopen({
    afterModel() {
      this._super(...arguments);

      const { hash } = location;
      if (hash && hash.length) {
        scheduleOnce('afterRender', null, () => {
          const anchor = document.querySelector(`a[href="${hash}"`);
          if (anchor) {
            anchor.scrollIntoView();
          }
        });
      }
    }
  })
}

export default {
  initialize
};
