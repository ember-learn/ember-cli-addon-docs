import Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import fetch from 'fetch';

// Adapted from https://github.com/ember-fastboot/ember-cli-fastboot/blob/1e3ed5d/fastboot/initializers/ajax.js
const httpRegex = /^https?:\/\//;
const protocolRelativeRegex = /^\/\//;

export default Service.extend({
  fastboot: computed(function() {
    return getOwner(this).lookup('service:fastboot');
  }),

  protocol: computed(function() {
    let protocol = this.get('fastboot.request.protocol');

    // In Prember the protocol is the string 'undefined', so we default to HTTP
    if (protocol === 'undefined:') {
      protocol = 'http:';
    } else if (!protocol) {
      protocol = location.protocol;
    }

    return protocol;
  }),

  host: computed(function() {
    return this.get('fastboot.request.host') || location.host;
  }),

  fetch(url, params) {
    if (protocolRelativeRegex.test(url)) {
      url = `${this.get('protocol')}${url}`;
    } else if (!httpRegex.test(url)) {
      try {
        url = `${this.get('protocol')}//${this.get('host')}${url}`;
      } catch (error) {
        throw new Error('For FastBoot support, you need to include `localhost` in your hostWhitelist property in environment.js. FastBoot Error: ' + error.message);
      }
    }

    return fetch(url, params);
  }
});
