import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';

export default class XSection extends Component {
  @localCopy('args.style', 'regular')
  style;
}
