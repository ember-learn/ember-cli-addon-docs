import { helper } from '@ember/component/helper';
import { capitalize } from '@ember/string';

export default helper(function capitalizeHelper(positional) {
  return capitalize(positional[0]);
});
