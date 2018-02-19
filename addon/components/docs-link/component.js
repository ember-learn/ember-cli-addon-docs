import LinkComponent from '@ember/routing/link-component';

import { classNames } from '@ember-decorators/component';

/**
  Just a styled subclass of LinkComponent. Comes in handy when rending links in Markdown templates:

  ```md
  Here I am, telling you about {{docs-link 'another page' 'docs.x-foo'}}
  ```
*/
@classNames('docs-md__a')
export default class DocsLinkComponent extends LinkComponent {}
