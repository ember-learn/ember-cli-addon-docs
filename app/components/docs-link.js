import LinkComponent from '@ember/routing/link-component';

/**
  Just a styled subclass of LinkComponent. Comes in handy when rending links in Markdown templates:

  ```md
  Here I am, telling you about {{docs-link 'another page' 'docs.x-foo'}}
  ```

  @class DocsLink
  @public
*/
export default LinkComponent.extend({

  classNames: 'docs-md__a'

});
