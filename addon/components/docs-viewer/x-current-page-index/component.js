import { tagName, layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

@templateLayout(layout)
@tagName('')
export default class XCurrentPageIndex extends Component {}
