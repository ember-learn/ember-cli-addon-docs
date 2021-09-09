import { classNames } from '@ember-decorators/component';
import LinkComponent from '@ember/routing/link-component';

/**
  Just a styled subclass of LinkComponent. Comes in handy when rending links in Markdown templates:

  ```md
  Here I am, telling you about <DocsLink @route="docs.x-foo">another page</DocsLink>
  ```

  @class DocsLink
  @public
*/
@classNames('docs-md__a')
export default class DocsLink extends LinkComponent {}
