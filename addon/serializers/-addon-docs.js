import Serializer from '@ember-data/serializer';

export default class AddonDocsSerializer extends Serializer {
  normalizeResponse(store, primaryModelClass, payload) {
    return payload;
  }
}
