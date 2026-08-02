import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class DocsHeaderLink extends Component {
  @service router;

  get isActive() {
    return this.router.isActive(this.args.route);
  }
}
