import { computed } from '@ember/object';
import { capitalize } from '@ember/string';

/**
  @hide
*/
export function memberUnion(parentMembersKey, childMembersKey) {
  return computed(`${parentMembersKey}.[]`, `${childMembersKey}.[]`, function() {
    let parentMembers = this.get(parentMembersKey);
    let childMembers = this.get(childMembersKey);

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
  });
}

function memberSort(a, b) {
  if (a.isStatic && !b.isStatic) {
    return -1;
  } else if (b.isStatic && !a.isStatic) {
    return 1;
  }

  if (
    a.access === 'public' && b.access !== 'public'
    || b.access === 'private' && a.access !== 'private'
  ) {
    return -1;
  } else if (
    a.access === 'private' && b.access !== 'private'
    || b.access === 'public' && a.access !== 'public') {
    return 1;
  }

  return a.name.localeCompare(b.name);
}

/**
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
    function() {
      let klass = this.get(classKey);
      let showInternal = this.get('showInternal');
      let showInherited = this.get('showInherited');
      let showProtected = this.get('showProtected');
      let showPrivate = this.get('showPrivate');
      let showDeprecated = this.get('showDeprecated');

      if (showInternal === false && memberType !== 'arguments') {
        return [];
      }

      let capitalKey = capitalize(memberType);

      let members = showInherited ? klass.get(`allPublic${capitalKey}`) : klass.get(`public${capitalKey}`);
      let privateMembers = showInherited ? klass.get(`allPrivate${capitalKey}`) : klass.get(`private${capitalKey}`);
      let protectedMembers = showInherited ? klass.get(`allProtected${capitalKey}`) : klass.get(`protected${capitalKey}`);

      if (showPrivate) {
        members.push(...privateMembers);
      }

      if (showProtected) {
        members.push(...protectedMembers);
      }

      if (!showDeprecated) {
        members = members.filter((m) => {
          return !m.tags || !m.tags.find(t => t.name === 'deprecated');
        });
      }

      return members.sort(memberSort);
    }
  );
}

/**
  @hide
*/
export function hasMemberType(...memberKeys) {
  let filter = memberKeys.pop();

  return computed(...memberKeys.map(k => `${k}.[]`), {
    get() {
      return memberKeys.some((memberKey) => {
        return this.get(memberKey).some((member) => filter(member, memberKey));
      });
    }
  });
}

