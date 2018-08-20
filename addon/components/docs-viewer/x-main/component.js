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

const tagToSize = { H2: 'xs', H3: 'xs' };
const tagToIndent = { H2: '0', H3: '4' };
const tagToMarginTop = { H2: '2', H3: '2' };
const tagToMarginBottom = { H2: '0', H3: '0' };

export default Component.extend({
  layout,

  router: service(),
  docsRoutes: service(),

  tagName: 'main',
  classNames: ['lg:docs-w-4/5', 'xl:docs-w-3/5', 'docs-max-w-md', 'lg:docs-max-w-none', 'docs-mx-auto', 'lg:docs-mx-0', 'docs-mt-6', 'docs-flex-no-shrink'],

  didInsertElement() {
    this._super(...arguments);

    let target = this.element.querySelector('[data-page-index-target]')

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
        .filter(file => file.match(/template.+(hbs|md)/))
        .find(file => file.match(path));

      return `${projectHref}/edit/${primaryBranch}/tests/dummy/app/${file}`;
    }
  })

});
