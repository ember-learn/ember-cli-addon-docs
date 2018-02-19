import Component from '@ember/component';

import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import layout from './template';

/**
  A component that renders a hero banner. Useful for your docs site's homepage.
*/
@classNames('docs-hero')
export default class DocsHeroComponent extends Component {
  layout = layout;

  @argument({ defaultIfUndefined: true })
  @type('string')
  logo = '';

  @argument({ defeaultIfUndefine: true })
  @type('string')
  slimHeading = '';

  @argument({ defeaultIfUndefine: true })
  @type('string')
  strongHeading = '';

  @argument({ defeaultIfUndefine: true })
  @type('string')
  byline = '';
}
