import Component from '@glimmer/component';

/**
  A `<LinkTo>` styled alternative. See [ember docs](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/input?anchor=LinkTo) on how to use it.


  ```hbs
  <DocsLink @route="post" @model={{post.id}}>
    Go to post
  </DocsLink>
  ```

  @class DocsLink
  @public
*/
export default class DocsLink extends Component {
  get isRouteOnly() {
    return (
      'route' in this.args &&
      !('model' in this.args) &&
      !('models' in this.args)
    );
  }

  get isRouteAndModelOnly() {
    return (
      'route' in this.args && 'model' in this.args && !('models' in this.args)
    );
  }

  get isRouteAndModelsOnly() {
    return (
      'route' in this.args && !('model' in this.args) && 'models' in this.args
    );
  }
}
