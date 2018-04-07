/** @documenter yuidoc */

import Helper from '@ember/component/helper';

/**
  A class based YUIDoc helper

  @class YUIDocClassHelper
 */
const YUIDocClassHelper = Helper.extend({
  /**
    returns the absolute value of a number

    @method compute
    @param {number} [number] the passed number
    @return {number}
  */
  compute([number]) {
    return Math.abs(number);
  }
});

export default YUIDocClassHelper;
