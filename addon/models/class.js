import Model, { attr, belongsTo } from '@ember-data/model';
import { filterBy, or, union } from '@ember/object/computed';
import { memberUnion, hasMemberType } from '../utils/computed';

export default class Class extends Model {
  @belongsTo('class', { async: false, inverse: null })
  parentClass;

  isClass = true;

  @attr
  name;

  @attr
  file;

  @attr
  exportType;

  @attr
  description;

  @attr
  lineNumber;

  @attr
  access;

  @attr
  accessors;

  @attr
  methods;

  @attr
  fields;

  @attr
  tags;

  @filterBy('accessors', 'access', 'public')
  publicAccessors;

  @filterBy('methods', 'access', 'public')
  publicMethods;

  @filterBy('fields', 'access', 'public')
  publicFields;

  @filterBy('accessors', 'access', 'private')
  privateAccessors;

  @filterBy('methods', 'access', 'private')
  privateMethods;

  @filterBy('fields', 'access', 'private')
  privateFields;

  @filterBy('accessors', 'access', 'protected')
  protectedAccessors;

  @filterBy('methods', 'access', 'protected')
  protectedMethods;

  @filterBy('fields', 'access', 'protected')
  protectedFields;

  @memberUnion('parentClass.allPublicAccessors', 'publicAccessors')
  allPublicAccessors;

  @memberUnion('parentClass.allPublicMethods', 'publicMethods')
  allPublicMethods;

  @memberUnion('parentClass.allPublicFields', 'publicFields')
  allPublicFields;

  @memberUnion('parentClass.allPrivateAccessors', 'privateAccessors')
  allPrivateAccessors;

  @memberUnion('parentClass.allPrivateMethods', 'privateMethods')
  allPrivateMethods;

  @memberUnion('parentClass.allPrivateFields', 'privateFields')
  allPrivateFields;

  @memberUnion('parentClass.allProtectedAccessors', 'protectedAccessors')
  allProtectedAccessors;

  @memberUnion('parentClass.allProtectedMethods', 'protectedMethods')
  allProtectedMethods;

  @memberUnion('parentClass.allProtectedFields', 'protectedFields')
  allProtectedFields;

  @union('allPublicAccessors', 'allPrivateAccessors', 'allProtectedAccessors')
  allAccessors;

  @union('allPublicMethods', 'allPrivateMethods', 'allProtectedMethods')
  allMethods;

  @union('allPublicFields', 'allPrivateFields', 'allProtectedFields')
  allFields;

  @or(
    'parentClass.allAccessors.length',
    'parentClass.allMethods.length',
    'parentClass.allFields.length',
  )
  hasInherited;

  @or(
    'allPrivateAccessors.length',
    'allPrivateMethods.length',
    'allPrivateFields.length',
  )
  hasPrivate;

  @or(
    'allProtectedAccessors.length',
    'allProtectedMethods.length',
    'allProtectedFields.length',
  )
  hasProtected;

  @hasMemberType(
    'allFields',
    'allAccessors',
    'allMethods',

    function (member) {
      return member.tags && member.tags.find((t) => t.name === 'deprecated');
    },
  )
  hasDeprecated;
}
