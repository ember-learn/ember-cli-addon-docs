import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

@tagName('ul')
@layout(hbs`
  {{yield (hash
    item=(component 'docs-viewer/x-nav-item')
  )}}
`)
export default class XNavList extends Component {}
