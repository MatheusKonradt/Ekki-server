const Response = require('../../../classes/api/Response');
const ErrorFactory = require('../../../classes/error/ErrorFactory');
const User = require('../../../classes/model/User');
const Transfer = require('../../../classes/model/Transfer');
const CommandFactory = require('../../../classes/command/CommandFactory');
const ACLInterceptorFactory = require('../../../classes/acl/ACLInterceptorFactory');
const Currency = require('../../../classes/enum/Currency');
const Status = require('../../../classes/enum/Status');

module.exports = {

  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {{}} data
   * @return {Promise<Response>}
   */
  async createTransfer(app, actor, data) {
    const transfer = new Transfer(app);
    transfer.amount = data.amount;
    transfer.currency = Currency[data.currency];
    transfer.fromWalletId = ObjectId(data.fromWalletId);
    transfer.toWalletId = ObjectId(data.toWalletId);
    transfer.userId = actor.getUserId();
    transfer.status = Status.DRAFTED;
    await transfer.save();

    const command = CommandFactory.getTransferCommand(transfer);
    const aclInterceptor = ACLInterceptorFactory.getCommandACLInterceptorInstance(actor, command);
    await aclInterceptor.execute(app);

    transfer.status = Status.EXECUTED;
    await transfer.save();

    const response = new Response();
    response.addResource('transfer', transfer.toJson());
    return response;
  }

};
