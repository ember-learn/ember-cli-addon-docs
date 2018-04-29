import Component from '@ember/component';
import layout from './template';
import config from 'dummy/config/environment';

const projectName = config['ember-cli-addon-docs'].projectName;

export default Component.extend({
  layout,
  classNames: ['import-path'],
  projectName
});
