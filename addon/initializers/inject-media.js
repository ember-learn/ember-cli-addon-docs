/**
  @function initialize
  @hide
*/
export function initialize(application) {
  application.inject('component', 'media', 'service:media');
  application.inject('controller', 'media', 'service:media');
}

export default {
  initialize
};
