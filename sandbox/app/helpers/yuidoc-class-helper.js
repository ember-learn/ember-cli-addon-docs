/** @documenter yuidoc */

import Helper from '@ember/component/helper';

/**
  A class based YUIDoc helper

  @class YUIDocClassHelper
 */
export default class YUIDocClassHelper extends Helper {
  /**
    returns the absolute value of a number

    @method compute
    @param {number} [number] the passed number
    @return {number}
  */
  compute([number]) {
    return Math.abs(number);
  }
}
