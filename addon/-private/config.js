import { getOwner } from '@ember/application';
import { cached } from 'tracked-toolbox';

/**
 * Function to get the currently configured rootURL from the containers.
 *
 * @function getRootURL
 * @private
 * @param {*} target Instance of an ember class that has an owner
 * @return {String} The currently configured rootURL
 */
export function getRootURL(target) {
  return getOwner(target).resolveRegistration('config:environment').rootURL;
}

/**
 * Function to get the current configuration of `ember-cli-addon-docs` from the
 * container.
 *
 * @function getAddonDocsConfig
 * @private
 * @param {*} target Instance of an ember class that has an owner
 * @return {Object} The `ember-cli-addon-docs` configuration object
 */
export function getAddonDocsConfig(target) {
  return getOwner(target).resolveRegistration('config:environment')[
    'ember-cli-addon-docs'
  ];
}

/**
 * Decorator to use the `ember-cli-addon-docs` configuration object on a class.
 *
 * Usage:
 *
 * ```js
 * class MyComponent extends Component {
 *   @addonDocsConfig config;
 *
 *   get projectName() {
 *     // will return the value of `projectName` configured in the
 *     // `ember-cli-addon-docs` section of the host configuration
 *     return this.config.projectName:
 *   }
 * }
 * ```
 *
 * @function addonDocsConfig
 * @private
 */
export function addonDocsConfig(target, property, descriptor) {
  return cached(target, property, {
    get() {
      return getAddonDocsConfig(this);
    },
  });
}
