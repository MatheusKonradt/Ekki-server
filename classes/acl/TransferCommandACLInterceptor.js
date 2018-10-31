const ErrorFactory = require('../error/ErrorFactory');
const CommandACLInterceptor = require('./CommandACLInterceptor');
const ActorType = require('../enum/ActorType');
const Wallet = require('../model/Wallet');

class TransferCommandACLInterceptor extends CommandACLInterceptor {
  /**
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    const transfer = this.command.getTransfer();
    const actor = this.getActor();

    const fromWallet = new Wallet(app);
    fromWallet.setSafeLoad(false);
    await fromWallet.loadFromDBWithId(transfer.fromWalletId);

    if (actor.getType() === ActorType.USER) {
      const ownerId = fromWallet.getResourceOwnerId();

      if (!ownerId || String(ownerId) !== String(actor.getUserId())){
        throw ErrorFactory.permission(actor, model);
      }
    }

    await this.command.execute(app);
  }
}

module.exports = TransferCommandACLInterceptor;
