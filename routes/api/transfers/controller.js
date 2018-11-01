const Response = require('../../../classes/api/Response');
const ErrorFactory = require('../../../classes/error/ErrorFactory');
const CommandFactory = require('../../../classes/command/CommandFactory');
const ACLInterceptorFactory = require('../../../classes/acl/ACLInterceptorFactory');
const { Currency, Status } = require('../../../classes/enum');
const { Transfer, User } = require('../../../classes/model');
const { Transfers } = require('../../../classes/collection');


module.exports = {

  /**
   * @param app
   * @param actor
   * @param userId
   * @return {Promise<Response>}
   */
  async listTransfersByUserId(app, actor, userId) { // FIXME missing ACLs
    const collection = new Transfers(app);
    const transfers = await collection.findByUserId(userId);
    const response = new Response();
    response.addResource('transfers', transfers);
    return response;
  },

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
    transfer.toUserId = data.toUserId;
    transfer.fromUserId = data.fromUserId;
    transfer.allowCreditCardUsage = data.allowCreditCardUsage;
    transfer.status = Status.DRAFTED;

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
