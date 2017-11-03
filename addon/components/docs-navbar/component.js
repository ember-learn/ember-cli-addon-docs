import { equal, match } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import config from 'dummy/config/environment';

const packageJson = config['ember-cli-addon-docs'].packageJson;

/**
  Render a header showing a link to your documentation, your project logo and
  a GitHub link to your addon's repository.

  @class DocsNavbar
  @public
*/
export default Component.extend({
  layout,
  router: service('-routing'),

  tagName: 'nav',
  classNames: 'docs-navbar',

  isHome: equal('router.currentPath', 'index'),
  isViewingDocs: match('router.currentPath', /docs/),

  githubUrl: packageJson.repository

});
