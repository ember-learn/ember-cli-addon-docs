import {
  classNames,
  layout as templateLayout,
} from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

@templateLayout(layout)
@classNames('docs-p-4')
export default class XExample extends Component {
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);
    this.set('elementId', 'example-' + this.name);
  }
}
