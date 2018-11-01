const Response = require('../../../classes/api/Response');
const { ErrorFactory } = require('../../../classes/error');
const { Card } = require('../../../classes/model');
const { Currency } = require('../../../classes/enum');

module.exports = {


  /**
   * @param {App} app
   * @param {Actor} actor
   * @param {{}} data
   * @return {Promise<Response>}
   */
  async createCard(app, actor, data) {
    const card = new Card(app);
    card.currency = Currency.BRL;
    card.debit = 0;
    card.limit = 100000;
    card.userId = data.userId;
    if (actor.getUserId().toString() !== card.userId.toString()) {
      throw ErrorFactory.permission(actor, card);
    }
    await card.save();
    const response = new Response();
    response.addResource('card', card.toJson());
    return response;
  }
};
