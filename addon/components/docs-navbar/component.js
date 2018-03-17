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

  tagName: '',

  githubUrl: packageJson.repository

});
