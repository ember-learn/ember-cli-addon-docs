import { tagName, layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

/*
  A component used to recursively render a nested structure of module nodes.
*/
@templateLayout(layout)
@tagName('')
export default class ModuleNav extends Component {}
