import Serializer from '@ember-data/serializer';

export default Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    return payload;
  }
});
