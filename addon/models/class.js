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

export default class Class {
  id = null;
  parentClass = null;

  isClass = true;

  name = null;
  file = null;
  exportType = null;
  description = null;
  lineNumber = null;
  access = null;
  accessors = null;
  methods = null;
  fields = null;
  tags = null;

  get publicAccessors() {
    return filterBy(this.accessors, 'access', 'public');
  }
  get publicMethods() {
    return filterBy(this.methods, 'access', 'public');
  }
  get publicFields() {
    return filterBy(this.fields, 'access', 'public');
  }

  get privateAccessors() {
    return filterBy(this.accessors, 'access', 'private');
  }
  get privateMethods() {
    return filterBy(this.methods, 'access', 'private');
  }
  get privateFields() {
    return filterBy(this.fields, 'access', 'private');
  }

  get protectedAccessors() {
    return filterBy(this.accessors, 'access', 'protected');
  }
  get protectedMethods() {
    return filterBy(this.methods, 'access', 'protected');
  }
  get protectedFields() {
    return filterBy(this.fields, 'access', 'protected');
  }

  get allPublicAccessors() {
    return memberUnionFn(
      this.parentClass?.allPublicAccessors,
      this.publicAccessors,
    );
  }
  get allPublicMethods() {
    return memberUnionFn(
      this.parentClass?.allPublicMethods,
      this.publicMethods,
    );
  }
  get allPublicFields() {
    return memberUnionFn(this.parentClass?.allPublicFields, this.publicFields);
  }

  get allPrivateAccessors() {
    return memberUnionFn(
      this.parentClass?.allPrivateAccessors,
      this.privateAccessors,
    );
  }
  get allPrivateMethods() {
    return memberUnionFn(
      this.parentClass?.allPrivateMethods,
      this.privateMethods,
    );
  }
  get allPrivateFields() {
    return memberUnionFn(
      this.parentClass?.allPrivateFields,
      this.privateFields,
    );
  }

  get allProtectedAccessors() {
    return memberUnionFn(
      this.parentClass?.allProtectedAccessors,
      this.protectedAccessors,
    );
  }
  get allProtectedMethods() {
    return memberUnionFn(
      this.parentClass?.allProtectedMethods,
      this.protectedMethods,
    );
  }
  get allProtectedFields() {
    return memberUnionFn(
      this.parentClass?.allProtectedFields,
      this.protectedFields,
    );
  }

  get allAccessors() {
    return [
      ...this.allPublicAccessors,
      ...this.allPrivateAccessors,
      ...this.allProtectedAccessors,
    ];
  }
  get allMethods() {
    return [
      ...this.allPublicMethods,
      ...this.allPrivateMethods,
      ...this.allProtectedMethods,
    ];
  }
  get allFields() {
    return [
      ...this.allPublicFields,
      ...this.allPrivateFields,
      ...this.allProtectedFields,
    ];
  }

  get hasInherited() {
    return !!(
      this.parentClass?.allAccessors?.length ||
      this.parentClass?.allMethods?.length ||
      this.parentClass?.allFields?.length
    );
  }

  get hasPrivate() {
    return !!(
      this.allPrivateAccessors.length ||
      this.allPrivateMethods.length ||
      this.allPrivateFields.length
    );
  }

  get hasProtected() {
    return !!(
      this.allProtectedAccessors.length ||
      this.allProtectedMethods.length ||
      this.allProtectedFields.length
    );
  }

  get hasDeprecated() {
    let isDeprecated = (member) =>
      member.tags && member.tags.find((t) => t.name === 'deprecated');

    return (
      this.allFields.some(isDeprecated) ||
      this.allAccessors.some(isDeprecated) ||
      this.allMethods.some(isDeprecated)
    );
  }
}
