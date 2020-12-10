import classic from 'ember-classic-decorator';
import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

@classic
@tagName('ul')
@layout(hbs`
  {{yield (hash
    item=(component 'docs-viewer/x-nav-item')
  )}}
`)
export default class XNavList extends Component {}
