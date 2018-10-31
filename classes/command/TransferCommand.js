const _ = require('lodash');
const ErrorFactory = require('../error/ErrorFactory');
const Command = require('./Command');
const Wallet = require('../model/Wallet');

class TransferCommand extends Command {
  /**
   * @param {Transfer} transfer
   * @return {TransferCommand}
   */
  constructor(transfer) {
    super(transfer);
    this.transfer = transfer;
  }

  /**
   * @return {Transfer}
   */
  getTransfer() {
    return this.transfer
  }

  /**
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    const transfer = this.getTransfer();
    const fromWallet = new Wallet(app);
    const toWallet = new Wallet(app);

    fromWallet.setSafeLoad(false);
    toWallet.setSafeLoad(false);

    await fromWallet.loadFromDBWithId(transfer.fromWalletId);
    await toWallet.loadFromDBWithId(transfer.toWalletId);

    // TODO normalize currency (BRL, USD, etc)

    if (fromWallet.amount < transfer.amount) {
      throw ErrorFactory.notEnoughFounds();
    }

    fromWallet.amount -= transfer.amount;
    toWallet.amount += transfer.amount;

    await fromWallet.save();
    await toWallet.save();
  }
}

module.exports = TransferCommand;
