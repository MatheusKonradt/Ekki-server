const ErrorFactory = require('../error/ErrorFactory');

class Command {
  /**
   * @param {Model} model
   */
  constructor(model) {
    this.setModel(model);
  }

  /**
   * @return {Model}
   */
  getModel() {
    return this.model;
  }

  /**
   * @param {Model} val
   * @return {Command}
   */
  setModel(val) {
    this.model = val;
    return this;
  }

  /**
   * @virtual
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    ErrorFactory.notImplemented().throw();
  }
}

module.exports = Command;