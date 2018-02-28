import Component from '@ember/component';
import layout from './template';
import config from 'dummy/config/environment';

const packageJson = config['ember-cli-addon-docs'].packageJson;

export default Component.extend({
  layout,
  classNames: ['import-path'],
  projectName: packageJson.name
});
