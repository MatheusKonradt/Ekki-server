const _ = require('lodash');
const ErrorFactory = require('../error/ErrorFactory');
const Command = require('./Command');

class PatchCommand extends Command {
  /**
   * @param {Model} model
   * @param {{}} patch
   * @param {string} patch.op
   * @param {string} patch.path
   * @param {*} patch.value
   * @return {PatchCommand}
   */
  constructor(model, { op, path, value }) {
    super(model);
    this.setOp(op);
    this.setPath(path);
    this.setValue(value);
    return this;
  }

  /**
   * @param {string} val
   * @return {PatchCommand}
   */
  setPath(val) {
    if (!val.startsWith('/')) throw ErrorFactory.badRequest(`Invalid path ${val}`);
    this.path = val.substr(1).replace('/', '.');
    return this;
  }

  /**
   * @param {string} val
   * @return {PatchCommand}
   */
  setOp(val) {
    this.op = val;
    return this;
  }

  /**
   * @param {*} val
   * @return {PatchCommand}
   */
  setValue(val) {
    this.value = val;
    return this;
  }

  /**
   * @return {string}
   */
  getOp() {
    return this.op;
  }

  /**
   * @return {string}
   */
  getPath() {
    return this.path;
  }

  /**
   * @return {*}
   */
  getValue() {
    return this.value;
  }

  /**
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    const model = this.getModel();
    const op = this.getOp();
    const path = this.getPath();
    const value = this.getValue();

    if (_.includes(['replace', 'add'], op)) {
      model[path] = value;
    } else if (op === 'remove') {
      model[path] = null;
    }
  }
}

module.exports = PatchCommand;
