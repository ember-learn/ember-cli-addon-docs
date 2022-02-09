import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';

/**
  A snippet component for demonstrating some code

  ```hbs
  <DocsSnippet @name={{snippet.name}} @unindent={{true}} @language={{snippet.language}} />
  ```

  @class DocsSnippet
  @public
*/

export default class DocsSnippet extends Component {
  /**
    The name of the snippet

    @argument name
    @type String?
  */

  /**
    The language of the snippet

    @argument language
    @type String?
  */

  /**
    The title of the snippet

    @argument title
    @type String?
  */

  /**
    Whether or not to show the copy button for this snippet

    @argument showCopy
    @type Boolean
    @default true
  */
  @localCopy('args.showCopy', true)
  showCopy;

  /**
    Whether or not the snippet should be unindented

    @argument unindent
    @type Boolean
    @default true
  */
  @localCopy('args.unindent', true)
  unindent;
}
