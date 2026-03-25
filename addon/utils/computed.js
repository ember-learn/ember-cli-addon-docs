import { capitalize } from './string';

function memberSort(a, b) {
  if (a.isStatic && !b.isStatic) {
    return -1;
  } else if (b.isStatic && !a.isStatic) {
    return 1;
  }

  if (
    (a.access === 'public' && b.access !== 'public') ||
    (b.access === 'private' && a.access !== 'private')
  ) {
    return -1;
  } else if (
    (a.access === 'private' && b.access !== 'private') ||
    (b.access === 'public' && a.access !== 'public')
  ) {
    return 1;
  }

  return a.name.localeCompare(b.name);
}

/**
 * Filters members of a class/component based on the current toggle state.
 *
 * @param {Object} klass - The class or component model
 * @param {string} memberType - The type of member ('accessors', 'methods', 'fields', 'arguments')
 * @param {Object} context - The component context with showInherited, showPrivate, etc.
 * @returns {Array} Filtered and sorted members
 */
export function filterMembers(klass, memberType, context) {
  let showInternal = context.showInternal;
  let showInherited = context.showInherited;
  let showProtected = context.showProtected;
  let showPrivate = context.showPrivate;
  let showDeprecated = context.showDeprecated;

  let members = [];

  if (showInternal === false && memberType !== 'arguments') {
    return members;
  }

  let capitalKey = capitalize(memberType);

  let publicMembers = showInherited
    ? klass[`allPublic${capitalKey}`]
    : klass[`public${capitalKey}`];
  let privateMembers = showInherited
    ? klass[`allPrivate${capitalKey}`]
    : klass[`private${capitalKey}`];
  let protectedMembers = showInherited
    ? klass[`allProtected${capitalKey}`]
    : klass[`protected${capitalKey}`];

  members.push(...(publicMembers || []));

  if (showPrivate) {
    members.push(...(privateMembers || []));
  }

  if (showProtected) {
    members.push(...(protectedMembers || []));
  }

  if (!showDeprecated) {
    members = members.filter((m) => {
      return !m.tags || !m.tags.find((t) => t.name === 'deprecated');
    });
  }

  return members.sort(memberSort);
}

/**
  @function initialize
  @hide
*/
export function addonLogo(name) {
  let logo;

  if (name.match(/ember-cli/)) {
    logo = 'ember-cli';
  } else if (name.match(/ember-data/)) {
    logo = 'ember-data';
  } else {
    logo = 'ember';
  }

  return logo;
}

let prefixMap = {
  'ember-cli': 'EmberCLI',
  'ember-data': 'EmberData',
  ember: 'Ember',
};
/**
  @function initialize
  @hide
*/
export function addonPrefix(name) {
  return prefixMap[addonLogo(name)];
}

/**
  @function initialize
  @hide
*/
export function unprefixedAddonName(name) {
  return name.replace(/ember-(cli-|data-)?/, '');
}
