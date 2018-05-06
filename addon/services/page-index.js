import Service from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

let tagToSize = {
  H2: 'sm',
  H3: 'xs',
};

let tagToIndent = {
  H2: '2',
  H3: '4',
};

let tagToMarginTop = {
  H2: '2',
  H3: '0',
};

let tagToMarginBottom = {
  H2: '1',
  H3: '0',
};

export default Service.extend({
  reindex(target) {
    scheduleOnce('afterRender', this, '_reindex', target);
  },

  _reindex(target) {
    let mainSection = document.querySelector('main');

    if (!mainSection) {
      return;
    }

    let headers = Array.from(
      mainSection.querySelectorAll('h2, h3')
    );

    this.set('index', headers.map((header) => {
      return {
        id: header.id,
        text: header.dataset.text || header.textContent,
        size: tagToSize[header.tagName],
        indent: tagToIndent[header.tagName],
        marginTop: tagToMarginTop[header.tagName],
        marginBottom: tagToMarginBottom[header.tagName],
      };
    }));
  }
});
