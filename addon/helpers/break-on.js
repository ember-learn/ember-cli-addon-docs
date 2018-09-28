import { helper } from '@ember/component/helper';

/**
  Helper function that inserts zero-width spaces after the break character, so
  that the string will break when wrapping only after that character.

  @function
  @hide
*/
export function breakOn([string, breakChar]) {
  return string.replace(new RegExp(breakChar, 'g'), `${breakChar}\u200B`)
}

export default helper(breakOn);
