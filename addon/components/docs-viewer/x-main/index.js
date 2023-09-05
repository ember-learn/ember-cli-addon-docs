import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { bind } from '@ember/runloop';
import appFiles from 'ember-cli-addon-docs/app-files';
import addonFiles from 'ember-cli-addon-docs/addon-files';
import { getOwner } from '@ember/application';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

const tagToSize = { H2: 'xxs', H3: 'xxs' };
const tagToIndent = { H2: '0', H3: '4' };
const tagToMarginTop = { H2: '2', H3: '2' };
const tagToMarginBottom = { H2: '0', H3: '0' };

export default class XMain extends Component {
  @service router;

  @service docsRoutes;

  @addonDocsConfig config;

  @action
  setupElement(element) {
    let target = element.querySelector('[data-current-page-index-target]');

    this._mutationObserver = new MutationObserver(
      bind(this, this.reindex, target),
    );

    this._mutationObserver.observe(target, { subtree: true, childList: true });

    this.reindex(target);
  }

  @action
  teardownElement() {
    this._mutationObserver.disconnect();
  }

  reindex(target) {
    let headers = Array.from(
      target.querySelectorAll('.docs-h2, .docs-h3, .docs-md__h2, .docs-md__h3'),
    );

    this.args.onReindex(
      headers.map((header) => {
        return {
          id: header.id,
          text: header.dataset.text || header.textContent,
          size: tagToSize[header.tagName],
          indent: tagToIndent[header.tagName],
          marginTop: tagToMarginTop[header.tagName],
          marginBottom: tagToMarginBottom[header.tagName],
        };
      }),
    );
  }

  get editCurrentPageUrl() {
    let path = this.router.currentRouteName;
    if (!path) {
      // `router` doesn't exist for old ember versions via ember-try
      return null;
    }

    let match = this._locateFile(path);
    if (match) {
      let { projectHref, addonPathInRepo, docsAppPathInRepo, primaryBranch } =
        this.config;
      let parts = [projectHref, 'edit', primaryBranch];
      if (match.inTree === 'addon') {
        parts.push(addonPathInRepo);
      } else {
        parts.push(docsAppPathInRepo);
      }
      parts.push(match.file);
      return parts.filter(Boolean).join('/');
    }

    return null;
  }

  _locateFile(path) {
    path = path.replace(/\./g, '/');
    if (path === 'docs/api/item') {
      let { projectName } = this.config;
      let model = getOwner(this)
        .lookup('route:application')
        .modelFor('docs.api.item');
      let filename = model.file.replace(new RegExp(`^${projectName}/`), '');
      let file = addonFiles.find((f) => f.match(filename));
      if (file) {
        return { file, inTree: 'addon' };
      }
    } else {
      let file = appFiles
        .filter((file) => file.match(/\.(hbs|md)$/))
        .find((file) => file.match(path));
      if (file) {
        return { file, inTree: 'app' };
      }
    }
  }
}
