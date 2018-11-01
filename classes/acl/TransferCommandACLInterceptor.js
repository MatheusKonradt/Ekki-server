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

    if (actor.getType() === ActorType.USER) {
      const ownerId = transfer.fromUserId;

      if (!ownerId || String(ownerId) !== String(actor.getUserId())){
        throw ErrorFactory.permission(actor, transfer);
      }
    }

    await this.command.execute(app);
  }
}

module.exports = TransferCommandACLInterceptor;
