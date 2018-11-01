const _ = require('lodash');
const ErrorFactory = require('../error/ErrorFactory');
const Command = require('./Command');
const { Wallet, Card } = require('../model');

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

    await fromWallet.loadFromDBWithUserId(transfer.fromUserId);
    await toWallet.loadFromDBWithUserId(transfer.toUserId);

    // TODO normalize currency (BRL to USD, etc)

    if (fromWallet.amount < transfer.amount) {

      if (!transfer.allowCreditCardUsage) {
        throw ErrorFactory.notEnoughFounds();
      }

      const card = new Card(app);
      card.setSafeLoad(false);
      await card.loadFromDBWithUserId(transfer.fromUserId);
      const lastingLimit = card.limit - card.debit;
      const missingAmount = transfer.amount - fromWallet.amount;

      if (lastingLimit < missingAmount) {
        throw ErrorFactory.notEnoughFounds();
      }

      card.debit += missingAmount;
      fromWallet.amount += missingAmount;
      await card.save();
    }

    fromWallet.amount -= transfer.amount;
    toWallet.amount += transfer.amount;

    await fromWallet.save();
    await toWallet.save();
  }
}

module.exports = TransferCommand;
