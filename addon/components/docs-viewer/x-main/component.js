import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';
import { computed } from '@ember/object';
import appFiles from 'ember-cli-addon-docs/app-files';
import addonFiles from 'ember-cli-addon-docs/addon-files';
import config from 'dummy/config/environment';
import { getOwner } from '@ember/application';

import layout from './template';

const { projectHref, primaryBranch } = config['ember-cli-addon-docs'];

const tagToSize = { H2: 'xxs', H3: 'xxs' };
const tagToIndent = { H2: '0', H3: '4' };
const tagToMarginTop = { H2: '2', H3: '2' };
const tagToMarginBottom = { H2: '0', H3: '0' };

export default Component.extend({
  layout,

  router: service(),
  docsRoutes: service(),

  tagName: 'main',
  classNames: [
    'docs-px-4', 'md:docs-px-8', 'lg:docs-px-20', 'docs-mx-auto', 'md:docs-mx-0', 'docs-mt-6',
    'md:docs-mt-12', 'md:docs-min-w-0', 'md:docs-flex-1'
  ],

  didInsertElement() {
    this._super(...arguments);

    let target = this.element.querySelector('[data-current-page-index-target]')

    this._mutationObserver = new MutationObserver(bind(this, this.reindex, target))

    this._mutationObserver.observe(target, { subtree: true, childList: true });

    this.reindex(target);
  },

  willDestroyElement() {
    this._super(...arguments);

    this._mutationObserver.disconnect();
  },

  reindex(target) {
    let headers = Array.from(
      target.querySelectorAll('.docs-h2, .docs-h3, .docs-md__h2, .docs-md__h3')
    );

    this.get('onReindex')(
      headers.map((header) => {
        return {
          id: header.id,
          text: header.dataset.text || header.textContent,
          size: tagToSize[header.tagName],
          indent: tagToIndent[header.tagName],
          marginTop: tagToMarginTop[header.tagName],
          marginBottom: tagToMarginBottom[header.tagName],
        };
      })
    );
  },

  editCurrentPageUrl: computed('router.currentRouteName', function() {
    let path = this.get('router.currentRouteName');
    if (!path) {
      // `router` doesn't exist for old ember versions via ember-try
      return;
    }

    path = path.replace(/\./g, '/');

    if (path === 'docs/api/item') {
      let { path } = getOwner(this).lookup('route:application').paramsFor('docs.api.item');
      let file = addonFiles.find(f => f.match(path));

      if (file) {
        return `${projectHref}/edit/${primaryBranch}/addon/${file}`;
      }
    } else {
      let file = appFiles
        .filter(file => file.match(/\.(hbs|md)$/))
        .find(file => file.match(path));

      return `${projectHref}/edit/${primaryBranch}/tests/dummy/app/${file}`;
    }
  })

});
