const Response = require('../../../classes/api/Response');
const { ErrorFactory }= require('../../../classes/error');
const CommandFactory = require('../../../classes/command/CommandFactory');
const ACLInterceptorFactory = require('../../../classes/acl/ACLInterceptorFactory');
const { Wallet, Card, User } = require('../../../classes/model');
const { Users } = require('../../../classes/collection');

module.exports = {

  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {ObjectId} next
   * @return {Promise<Response>}
   */
  async getUsersList(app, actor, { next }) {
    const collection = new Users(app);
    const limit = 50;
    const query = { _id: { $ne: actor.getUserId() } }; // FIXME this query must be abstracted
    if (next) query._id.$gt = next;
    const users = await collection.find(query, { limit });
    const response = new Response();
    response.addResource('users', users);
    return response;
  },

  /**
   * @param {App} app
   * @param {ObjectId} userId
   * @return {Promise<Response>}
   */
  async getUserById(app, userId) {
    const user = new User(app);

    if (!(await user.loadFromDBWithId(userId))) {
      throw ErrorFactory.resourceNotFound();
    }

    const response = new Response();
    response.addResource('user', user.toJson());
    return response;
  },

  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {ObjectId} userId
   * @return {Promise<Response>}
   */
  async getUserWallet(app, actor, userId) {
    const wallet = new Wallet(app);
    wallet.setSafeLoad(false);
    await wallet.loadFromDBWithUserId(userId);
    if (actor.getUserId().toString() !== userId.toString()) {
      throw ErrorFactory.permission(actor, wallet);
    }
    const response = new Response();
    response.addResource('wallet', wallet.toJson());
    return response;
  },

  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {ObjectId} userId
   * @return {Promise<Response>}
   */
  async getUserCard(app, actor, userId) {
    const card = new Card(app);
    card.setSafeLoad(false);
    await card.loadFromDBWithUserId(userId);
    if (actor.getUserId().toString() !== userId.toString()) {
      throw ErrorFactory.permission(actor, card);
    }
    const response = new Response();
    response.addResource('card', card.toJson());
    return response;
  },

  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {ObjectId} userId
   * @param {*} patches
   * @return {Promise<Response>}
   */
  async patchUserById(app, actor, userId, patches) {
    const user = new User(app);
    const wasUserFound = await user.loadFromDBWithId(userId);

    if (!wasUserFound) {
      throw ErrorFactory.resourceNotFound();
    }

    for (const patch of patches) {
      const command = CommandFactory.getPatchCommandInstance(user, patch);
      const aclInterceptor = ACLInterceptorFactory.getCommandACLInterceptorInstance(actor, command);
      await aclInterceptor.execute(app);
    }

    await user.save();

    const response = new Response();
    response.addResource('user', user.toJson());
    return response;
  }

};
