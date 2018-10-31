const ErrorFactory = require('../error/ErrorFactory');
const CommandACLInterceptor = require('./CommandACLInterceptor');
const TransferCommandACLInterceptor = require('./TransferCommandACLInterceptor');
const TransferCommand = require('../command/TransferCommand');

class ACLInterceptorFactory {
  /**
   * @param {Actor} actor
   * @param {Command} command
   * @return {CommandACLInterceptor}
   */
  static getCommandACLInterceptorInstance(actor, command) {
    if (command instanceof TransferCommand) return new TransferCommandACLInterceptor(actor, command);
    return new CommandACLInterceptor(actor, command);
  }
}

module.exports = ACLInterceptorFactory;
