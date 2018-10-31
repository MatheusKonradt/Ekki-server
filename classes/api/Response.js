const Model = require('../database/Model');

class Response {
  constructor() {
    this.resources = {};
    this.links = {};
  }

  /**
   * @param {string} rel
   * @param {string} method
   * @param {string} href
   * @param {Object} [body]
   * @return {Response}
   */
  addLink(rel, method, href, body) {
    this.links[rel] = {
      method, href, body,
    };
    return this;
  }

  /**
   * @param {string} alias
   * @param {*} resource
   * @return {Response}
   */
  addResource(alias, resource) {
    this.resources[alias] = resource;
    return this;
  }

  toJson() {
    return {
      resources: this.resources,
      links: this.links,
    };
  }
}

module.exports = Response;
