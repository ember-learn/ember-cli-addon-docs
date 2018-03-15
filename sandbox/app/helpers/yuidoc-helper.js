/** @documenter yuidoc */

import { helper } from '@ember/component/helper';

/**
  returns the absolute value of a number

  @function yuidocHelper
  @param {number} [number] the passed number
  @return {number}
*/
export function yuidocHelper([number]) {
  return Math.abs(number);
}

export default helper(yuidocHelper);
