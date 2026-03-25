/* global FastBoot */
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { getRootURL } from 'ember-cli-addon-docs/-private/config';

import Project from '../models/project';
import Module from '../models/module';
import Class from '../models/class';
import Component from '../models/component';

const MODEL_CLASSES = {
  project: Project,
  module: Module,
  class: Class,
  component: Component,
};

/**
 * A lightweight store that replaces ember-data for loading and caching
 * documentation JSON. Fetches JSON API payloads from the build output
 * and deserializes them into plain tracked objects.
 */
export default class DocsStoreService extends Service {
  @tracked _records = {
    project: {},
    module: {},
    class: {},
    component: {},
  };

  _fetches = {};

  async findRecord(type, id) {
    let existing = this._records[type]?.[id];
    if (existing) return existing;

    if (type === 'project') {
      if (!this._fetches[id]) {
        this._fetches[id] = this._fetchProject(id);
      }
      return this._fetches[id];
    }

    return null;
  }

  peekRecord(type, id) {
    return this._records[type]?.[id] || null;
  }

  peekAll(type) {
    return Object.values(this._records[type] || {});
  }

  async _fetchProject(id) {
    let payload;

    let fastboot = getOwner(this).lookup('service:fastboot');
    if (fastboot?.isFastBoot) {
      // In FastBoot, use Node's http module to fetch from the local server
      // that prember/fastboot is running
      let http = FastBoot.require('http');
      let request = fastboot.request;
      // Derive host and protocol from the FastBoot/Node request in a standards-based way
      let host =
        (request && request.headers && (request.headers.host || request.headers.Host)) ||
        request.host;
      let protocol =
        (request && request.protocol) ||
        (request &&
          request.headers &&
          (request.headers['x-forwarded-proto'] || request.headers['X-Forwarded-Proto'])) ||
        'http';
      let url = `${protocol}://${host}/docs/${id}.json`;

      let data = await new Promise((resolve, reject) => {
        http
          .get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve(body));
          })
          .on('error', reject);
      });

      payload = JSON.parse(data);
    } else {
      let namespace = `${getRootURL(this).replace(/\/$/, '')}/docs`;
      let url = `${namespace}/${id}.json`;
      let response = await fetch(url);
      payload = await response.json();
    }

    this._loadPayload(payload);

    return this._records.project[id];
  }

  _loadPayload(payload) {
    let allRecords = [];

    // Collect data (can be single or array)
    let dataItems = Array.isArray(payload.data) ? payload.data : [payload.data];
    allRecords.push(...dataItems);

    // Collect included
    if (payload.included) {
      allRecords.push(...payload.included);
    }

    // First pass: create all record instances with attributes
    for (let raw of allRecords) {
      let { type, id, attributes } = raw;
      if (!MODEL_CLASSES[type]) continue;

      let ModelClass = MODEL_CLASSES[type];
      let record = new ModelClass();
      record.id = id;

      if (attributes) {
        for (let [key, value] of Object.entries(attributes)) {
          record[key] = value;
        }
      }

      this._records[type][id] = record;
    }

    // Second pass: resolve relationships
    for (let raw of allRecords) {
      let { type, id, relationships } = raw;
      if (!relationships || !this._records[type]?.[id]) continue;

      let record = this._records[type][id];
      for (let [key, rel] of Object.entries(relationships)) {
        if (rel.data === null || rel.data === undefined) {
          record[key] = null;
        } else if (Array.isArray(rel.data)) {
          record[key] = rel.data
            .map((ref) => this._records[ref.type]?.[ref.id])
            .filter(Boolean);
        } else {
          record[key] = this._records[rel.data.type]?.[rel.data.id] || null;
        }
      }
    }

    // Trigger reactivity update
    this._records = { ...this._records };
  }
}
