import { helper } from '@ember/component/helper';
import { capitalize } from '../utils/string';

export default helper(function capitalizeHelper(positional) {
  return capitalize(positional[0]);
});
