import Component from '@ember/component';
import { tagName, classNames } from '@ember-decorators/component';

import layout from './template';

/**
 * @hideDoc
 */
@tagName('nav')
@classNames('class-index')
export default class ApiComponentIndex extends Component {
  layout = layout;
}
