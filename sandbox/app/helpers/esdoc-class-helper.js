/** @documenter esdoc */

import Helper from '@ember/component/helper';

/**
  A class based ESDoc helper
 */
export default class ESDocClassHelper extends Helper {
  /**
    returns the absolute value of a number

    @param {number} [number] the passed number
    @return {number}
  */
  compute([number]) {
    return Math.abs(number);
  }
}
