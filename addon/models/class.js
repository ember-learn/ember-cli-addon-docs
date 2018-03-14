import DS from 'ember-data';
import {
  filterBy,
  or,
  union
} from '@ember/object/computed';
import { memberUnion, hasMemberType } from '../utils/computed';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  parentClass: belongsTo('class', { async: false, inverse: null }),

  isClass: true,

  name: attr(),
  file: attr(),
  exportType: attr(),
  description: attr(),
  lineNumber: attr(),
  access: attr(),

  accessors: attr(),
  methods: attr(),
  fields: attr(),
  tags: attr(),

  publicAccessors: filterBy('accessors', 'access', 'public'),
  publicMethods: filterBy('methods', 'access', 'public'),
  publicFields: filterBy('fields', 'access', 'public'),

  privateAccessors: filterBy('accessors', 'access', 'private'),
  privateMethods: filterBy('methods', 'access', 'private'),
  privateFields: filterBy('fields', 'access', 'private'),

  protectedAccessors: filterBy('accessors', 'access', 'protected'),
  protectedMethods: filterBy('methods', 'access', 'protected'),
  protectedFields: filterBy('fields', 'access', 'protected'),

  allPublicAccessors: memberUnion('parentClass.allPublicAccessors', 'publicAccessors'),
  allPublicMethods: memberUnion('parentClass.allPublicMethods', 'publicMethods'),
  allPublicFields: memberUnion('parentClass.allPublicFields', 'publicFields'),

  allPrivateAccessors: memberUnion('parentClass.allPrivateAccessors', 'privateAccessors'),
  allPrivateMethods: memberUnion('parentClass.allPrivateMethods', 'privateMethods'),
  allPrivateFields: memberUnion('parentClass.allPrivateFields', 'privateFields'),

  allProtectedAccessors: memberUnion('parentClass.allProtectedAccessors', 'protectedAccessors'),
  allProtectedMethods: memberUnion('parentClass.allProtectedMethods', 'protectedMethods'),
  allProtectedFields: memberUnion('parentClass.allProtectedFields', 'protectedFields'),

  allAccessors: union('allPublicAccessors', 'allPrivateAccessors', 'allProtectedAccessors'),
  allMethods: union('allPublicMethods', 'allPrivateMethods', 'allProtectedMethods'),
  allFields: union('allPublicFields', 'allPrivateFields', 'allProtectedFields'),

  hasInherited: or(
    'parentClass.allAccessors.length',
    'parentClass.allMethods.length',
    'parentClass.allFields.length'
  ),

  hasPrivate: or(
    'allPrivateAccessors.length',
    'allPrivateMethods.length',
    'allPrivateFields.length'
  ),

  hasProtected: or(
    'allProtectedAccessors.length',
    'allProtectedMethods.length',
    'allProtectedFields.length'
  ),

  hasDeprecated: hasMemberType(
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.tags && member.tags.find(t => t.name === 'deprecated');
    }
  )
});
