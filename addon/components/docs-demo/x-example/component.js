import classic from 'ember-classic-decorator';
import { classNames, layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

@classic
@templateLayout(layout)
@classNames('docs-p-4')
export default class XExample extends Component {
  init() {
    super.init(...arguments);
    this.set('elementId', 'example-' + this.name);
  }
}
