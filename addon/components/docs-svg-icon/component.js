import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

import layout from './template';

@tagName('')
export default class DocsSvgIconComponent extends Component {
  layout = layout;

  static positionalParams = ['icon'];

  @argument
  @required
  icon;

  @argument({ defaultIfUndefined: true })
  @type('number')
  height = 16;

  @argument({ defaultIfUndefined: true })
  @type('number')
  width = 16;
}
