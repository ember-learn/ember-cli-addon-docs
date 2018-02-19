import Component from '@ember/component';
import config from 'dummy/config/environment';

import { tagName, classNames } from '@ember-decorators/component';

import layout from './template';

const packageJson = config['ember-cli-addon-docs'].packageJson;

/**
  Render a header showing a link to your documentation, your project logo and
  a GitHub link to your addon's repository.
*/
@tagName('nav')
@classNames('docs-navbar')
export default class DocsNavbarComponent extends Component {
  layout = layout;
  githubUrl = packageJson.repository;
}
