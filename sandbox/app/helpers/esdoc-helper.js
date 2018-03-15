/** @documenter esdoc */

import { helper } from '@ember/component/helper';

/**
  returns the absolute value of a number

  @param {number} [number] the passed number
  @return {number}
*/
export function esdocHelper([number]) {
  return Math.abs(number);
}

export default helper(esdocHelper);
