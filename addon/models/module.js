export default class Module {
  id = null;
  file = null;
  variables = null;
  functions = null;
  classes = null;
  components = null;

  get routingId() {
    return `modules/${this.id}`;
  }
}
