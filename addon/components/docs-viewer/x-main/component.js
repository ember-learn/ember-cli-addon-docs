import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import appFiles from 'ember-cli-addon-docs/app-files';
import { dasherize } from '@ember/string';
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
      // `routing` doesn't exist for old ember versions via ember-try
      return;
    }
    path = path.replace(/\./g, '/');

    if (path === 'docs/api/class') {
      let params = getOwner(this).lookup('route:application').paramsFor('docs.api.class');
      let klass = dasherize(params.class_id.replace(/-.+$/g, ''));
      let path = `pods/${path}`;

      return `${packageJson.repository}/edit/master/addon/components/${klass}/component.js`;
    } else {
      let templatePath = `pods/${path}`;
      let file = appFiles.find(file => file.match(`${templatePath}/template.(hbs|md)`));

      return `${packageJson.repository}/edit/master/tests/dummy/app/${file}`;
    }
  })

});
