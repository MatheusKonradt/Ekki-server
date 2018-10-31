const ErrorFactory = require('../error/ErrorFactory');

class ACLInterceptor {
  /**
   * @param {Actor} actor
   */
  constructor(actor) {
    /**
     * @private
     * @type {Actor}
     */
    this.actor = actor;
  }

  /**
   * @return {Actor}
   */
  getActor() {
    return this.actor;
  }

  /**
   * @virtual
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    throw ErrorFactory.notImplemented();
  }
}

module.exports = ACLInterceptor;
