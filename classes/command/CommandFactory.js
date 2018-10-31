const ErrorFactory = require('../error/ErrorFactory');
const PatchCommand = require('./PatchCommand');
const TransferCommand = require('./TransferCommand');

class CommandFactory {
  /**
   * @param {Model} model
   * @param {*} patch
   * @return {PatchCommand}
   */
  static getPatchCommandInstance(model, patch) {
    return new PatchCommand(model, patch);
  }

  /**
   *
   * @param {Transfer} transfer
   * @return {TransferCommand}
   */
  static getTransferCommand(transfer) {
    return new TransferCommand(transfer);
  }
}

module.exports = CommandFactory;
