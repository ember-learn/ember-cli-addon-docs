import classic from 'ember-classic-decorator';
import { classNames, tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { bind } from '@ember/runloop';
import appFiles from 'ember-cli-addon-docs/app-files';
import addonFiles from 'ember-cli-addon-docs/addon-files';
import config from 'ember-get-config';
import { getOwner } from '@ember/application';

import layout from './template';

const tagToSize = { H2: 'xxs', H3: 'xxs' };
const tagToIndent = { H2: '0', H3: '4' };
const tagToMarginTop = { H2: '2', H3: '2' };
const tagToMarginBottom = { H2: '0', H3: '0' };

@classic
@templateLayout(layout)
@tagName('main')
@classNames(
  'docs-px-4',
  'md:docs-px-8',
  'lg:docs-px-20',
  'docs-mx-auto',
  'md:docs-mx-0',
  'docs-mt-6',
  'md:docs-mt-12',
  'md:docs-min-w-0',
  'md:docs-flex-1'
)
export default class XMain extends Component {
  @service
  router;

  @service
  docsRoutes;

  didInsertElement() {
    super.didInsertElement(...arguments);

    let target = this.element.querySelector('[data-current-page-index-target]')

    this._mutationObserver = new MutationObserver(bind(this, this.reindex, target))

    this._mutationObserver.observe(target, { subtree: true, childList: true });

    this.reindex(target);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this._mutationObserver.disconnect();
  }

  reindex(target) {
    let headers = Array.from(
      target.querySelectorAll('.docs-h2, .docs-h3, .docs-md__h2, .docs-md__h3')
    );

    this.onReindex(
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
  }

  @computed('router.currentRouteName')
  get editCurrentPageUrl() {
    let path = this.get('router.currentRouteName');
    if (!path) {
      // `router` doesn't exist for old ember versions via ember-try
      return;
    }

    let match = this._locateFile(path);
    if (match) {
      let { projectHref, addonPathInRepo, docsAppPathInRepo, primaryBranch } = config['ember-cli-addon-docs'];
      let parts = [projectHref, 'edit', primaryBranch];
      if (match.inTree === 'addon') {
        parts.push(addonPathInRepo);
      } else {
        parts.push(docsAppPathInRepo);
      }
      parts.push(match.file);
      return parts.filter(Boolean).join('/');
    }
  }

  _locateFile(path) {
    path = path.replace(/\./g, '/');
    if (path === 'docs/api/item') {
      let { projectName } = config['ember-cli-addon-docs'];
      let model = getOwner(this).lookup('route:application').modelFor('docs.api.item');
      let filename = model.get('file').replace(new RegExp(`^${projectName}/`), '');
      let file = addonFiles.find(f => f.match(filename));
      if (file) {
        return { file, inTree: 'addon' };
      }
    } else {
      let file = appFiles
        .filter(file => file.match(/\.(hbs|md)$/))
        .find(file => file.match(path));
      if (file) {
        return { file, inTree: 'app' };
      }
    }
  }
}
