import Model, { attr, hasMany } from '@ember-data/model';

export default class Module extends Model {
  @attr
  file;

  @attr
  variables;

  @attr
  functions;

  @hasMany('class', { async: false, inverse: null })
  classes;

  @hasMany('class', { async: false, inverse: null })
  components;

  /*
    This gives us a way to link to a model, since we don't always link by the actual ID:

      <LinkTo @route="item" @model={{model.routingId}}>
        Go to item
      </LinkTo>

    Possible refactoring is to always link by actual ID, and implement redirects.
  */
  get routingId() {
    return `modules/${this.id}`;
  }
}
