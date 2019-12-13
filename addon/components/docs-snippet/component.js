import Component from '@ember/component';
import layout from './template';

/**
  A snippet component for demonstrating some code

  ```hbs
  {{docs-snippet name=snippet.name unindent=true language=snippet.language}}
  ```

  @class DocsSnippet
  @public
*/
export default Component.extend({
  tagName: '',
  layout,

  /**
    The name of the snippet

    @argument name
    @type String?
  */
  name: null,

  /**
    The language of the snippet

    @argument language
    @type String?
  */
  language: null,

  /**
    The title of the snippet

    @argument title
    @type String?
  */
  title: null,

  /**
    Whether or not to show the copy button for this snippet

    @argument showCopy
    @type Boolean
  */
  showCopy: true,

  /**
    Whether or not the snippet should be unindented

    @argument unindent
    @type Boolean
  */
  unindent: true,
});
