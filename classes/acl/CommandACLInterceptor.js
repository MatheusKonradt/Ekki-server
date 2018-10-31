const ErrorFactory = require('../error/ErrorFactory');
const ACLInterceptor = require('./ACLInterceptor');
const ActorType = require('../enum/ActorType');

class CommandACLInterceptor extends ACLInterceptor {
  /**
   * @param {Actor} actor
   * @param {Command} command
   */
  constructor(actor, command) {
    super(actor);
    this.command = command;
  }

  /**
   * @param {App} app
   * @return {Promise<void>}
   */
  async execute(app) {
    const model = this.command.getModel();
    const actor = this.getActor();

    if (actor.getType() === ActorType.USER) {
      const ownerId = model.getResourceOwnerId();

      if (!ownerId || String(ownerId) !== String(actor.getUserId())){
        throw ErrorFactory.permission(actor, model);
      }
    }

    await this.command.execute(app);
  }
}

module.exports = CommandACLInterceptor;
