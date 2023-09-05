import { computed, get } from '@ember/object';
import { capitalize } from '@ember/string';

/**
  @function initialize
  @hide
*/
export function memberUnion(parentMembersKey, childMembersKey) {
  return computed(
    `${parentMembersKey}.[]`,
    `${childMembersKey}.[]`,
    function () {
      let parentMembers = get(this, parentMembersKey);
      let childMembers = get(this, childMembersKey);

      if (!parentMembers) {
        return childMembers;
      }

      let union = {};

      for (let member of parentMembers) {
        union[member.name] = member;
      }

      for (let member of childMembers) {
        union[member.name] = member;
      }

      return Object.values(union);
    },
  );
}

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
  @function initialize
  @hide
*/
export function memberFilter(classKey, memberType) {
  return computed(
    classKey,
    'showInherited',
    'showInternal',
    'showProtected',
    'showPrivate',
    'showDeprecated',
    function () {
      let klass = get(this, classKey);
      let showInternal = this.showInternal;
      let showInherited = this.showInherited;
      let showProtected = this.showProtected;
      let showPrivate = this.showPrivate;
      let showDeprecated = this.showDeprecated;

      let members = [];

      if (showInternal === false && memberType !== 'arguments') {
        return members;
      }

      let capitalKey = capitalize(memberType);

      let publicMembers = showInherited
        ? klass.get(`allPublic${capitalKey}`)
        : klass.get(`public${capitalKey}`);
      let privateMembers = showInherited
        ? klass.get(`allPrivate${capitalKey}`)
        : klass.get(`private${capitalKey}`);
      let protectedMembers = showInherited
        ? klass.get(`allProtected${capitalKey}`)
        : klass.get(`protected${capitalKey}`);

      members.push(...publicMembers);

      if (showPrivate) {
        members.push(...privateMembers);
      }

      if (showProtected) {
        members.push(...protectedMembers);
      }

      if (!showDeprecated) {
        members = members.filter((m) => {
          return !m.tags || !m.tags.find((t) => t.name === 'deprecated');
        });
      }

      return members.sort(memberSort);
    },
  );
}

/**
  @function initialize
  @hide
*/
export function hasMemberType(...memberKeys) {
  let filter = memberKeys.pop();

  return computed(...memberKeys.map((k) => `${k}.[]`), {
    get() {
      return memberKeys.some((memberKey) => {
        return get(this, memberKey).some((member) => filter(member, memberKey));
      });
    },
  });
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
