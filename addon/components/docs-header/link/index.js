import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class DocsHeaderLink extends Component {
  @service router;

  get isActive() {
    return this.router.isActive(this.args.route);
  }
}
