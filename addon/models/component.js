import { attr } from '@ember-data/model';
import { filterBy, or } from '@ember/object/computed';
import { dasherize } from '@ember/string';

import Class from './class';
import { memberUnion, hasMemberType } from '../utils/computed';

export default class Component extends Class {
  isComponent = true;

  @attr
  yields;

  @attr
  arguments;

  @or('yields', 'inheritedYields')
  overloadedYields;

  @filterBy('arguments', 'access', 'public')
  publicArguments;

  @filterBy('arguments', 'access', 'private')
  privateArguments;

  @filterBy('arguments', 'access', 'protected')
  protectedArguments;

  @memberUnion('parentClass.allPublicArguments', 'publicArguments')
  allPublicArguments;

  @memberUnion('parentClass.allPrivateArguments', 'privateArguments')
  allPrivateArguments;

  @memberUnion('parentClass.allProtectedArguments', 'protectedArguments')
  allProtectedArguments;

  @memberUnion('parentClass.allArguments', 'arguments')
  allArguments;

  @or(
    'parentClass.overloadedYields.length',
    'parentClass.allArguments.length',
    'parentClass.allAccessors.length',
    'parentClass.allMethods.length',
    'parentClass.allFields.length',
  )
  hasInherited;

  @or('allAccessors.length', 'allMethods.length', 'allFields.length')
  hasInternal;

  @or(
    'allPrivateAccessors.length',
    'allPrivateArguments.length',
    'allPrivateMethods.length',
    'allPrivateFields.length',
  )
  hasPrivate;

  @or(
    'allProtectedAccessors.length',
    'allProtectedArguments.length',
    'allProtectedMethods.length',
    'allProtectedFields.length',
  )
  hasProtected;

  @hasMemberType(
    'allAccessors',
    'allArguments',
    'allMethods',
    'allFields',

    function (member) {
      return member.tags && member.tags.find((t) => t.name === 'deprecated');
    },
  )
  hasDeprecated;

  /*
    This gives us a way to link to a model, since we don't always link by the actual ID:

      <LinkTo @route="item" @model={{model.routingId}}>
        Go to item
      </LinkTo>

    Possible refactoring is to always link by actual ID, and implement redirects.
  */
  get routingId() {
    return `components/${dasherize(this.name)}`;
  }
}
