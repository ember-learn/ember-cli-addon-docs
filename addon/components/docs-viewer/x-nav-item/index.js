import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { next } from '@ember/runloop';

export default class XNavItem extends Component {
  @service docsRoutes;

  constructor() {
    super(...arguments);
    let model = this.args.model;

    if (typeof model === 'string' && model.includes('#')) {
      return;
    }

    next(() => {
      this.docsRoutes.items.addObject(this);
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.docsRoutes.items.removeObject(this);
  }
}
