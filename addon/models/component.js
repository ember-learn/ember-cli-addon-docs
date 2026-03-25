import { dasherize } from '../utils/string';
import Class from './class';

function filterBy(array, key, value) {
  return (array || []).filter((item) => item[key] === value);
}

function memberUnionFn(parentMembers, childMembers) {
  if (!parentMembers) return childMembers || [];

  let union = {};
  for (let member of parentMembers) {
    union[member.name] = member;
  }
  for (let member of childMembers || []) {
    union[member.name] = member;
  }
  return Object.values(union);
}

export default class Component extends Class {
  isComponent = true;

  yields = null;
  arguments = null;

  get overloadedYields() {
    return this.yields || this.inheritedYields;
  }

  get publicArguments() {
    return filterBy(this.arguments, 'access', 'public');
  }
  get privateArguments() {
    return filterBy(this.arguments, 'access', 'private');
  }
  get protectedArguments() {
    return filterBy(this.arguments, 'access', 'protected');
  }

  get allPublicArguments() {
    return memberUnionFn(
      this.parentClass?.allPublicArguments,
      this.publicArguments,
    );
  }
  get allPrivateArguments() {
    return memberUnionFn(
      this.parentClass?.allPrivateArguments,
      this.privateArguments,
    );
  }
  get allProtectedArguments() {
    return memberUnionFn(
      this.parentClass?.allProtectedArguments,
      this.protectedArguments,
    );
  }

  get allArguments() {
    return memberUnionFn(this.parentClass?.allArguments, this.arguments);
  }

  get hasInherited() {
    return !!(
      this.parentClass?.overloadedYields?.length ||
      this.parentClass?.allArguments?.length ||
      this.parentClass?.allAccessors?.length ||
      this.parentClass?.allMethods?.length ||
      this.parentClass?.allFields?.length
    );
  }

  get hasInternal() {
    return !!(
      this.allAccessors.length ||
      this.allMethods.length ||
      this.allFields.length
    );
  }

  get hasPrivate() {
    return !!(
      this.allPrivateAccessors.length ||
      this.allPrivateArguments.length ||
      this.allPrivateMethods.length ||
      this.allPrivateFields.length
    );
  }

  get hasProtected() {
    return !!(
      this.allProtectedAccessors.length ||
      this.allProtectedArguments.length ||
      this.allProtectedMethods.length ||
      this.allProtectedFields.length
    );
  }

  get hasDeprecated() {
    let isDeprecated = (member) =>
      member.tags && member.tags.find((t) => t.name === 'deprecated');

    return (
      this.allAccessors.some(isDeprecated) ||
      this.allArguments.some(isDeprecated) ||
      this.allMethods.some(isDeprecated) ||
      this.allFields.some(isDeprecated)
    );
  }

  get routingId() {
    return `components/${dasherize(this.name)}`;
  }
}
