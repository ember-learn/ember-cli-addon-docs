import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import appFiles from 'ember-cli-addon-docs/app-files';
import addonFiles from 'ember-cli-addon-docs/addon-files';
import config from 'dummy/config/environment';
import { getOwner } from '@ember/application';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Component.extend({
  layout,

  docsRoutes: service(),
  router: service(),

  tagName: '',

  // elementId: 'docs-viewer__scroll-body',
  // classNames: 'docs-viewer__main',

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
        return `${packageJson.repository}/edit/master/addon/${file}`;
      }
    } else {
      let file = appFiles
        .filter(file => file.match(/template.(hbs|md)/))
        .find(file => file.match(path));

      return `${packageJson.repository}/edit/master/tests/dummy/app/${file}`;
    }
  })

});
