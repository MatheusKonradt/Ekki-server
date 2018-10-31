const _ = require('lodash');
const Schema = require('../schema/Schema');
const Model = require('../database/Model');
const Wallets = require('../collection/Wallets');
const Currency = require('../enum/Currency');

class Wallet extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new Wallets(app);
    this.setCollection(collection);
    this.setSchema(Wallet.SCHEMA);
    this.seal();
  }

  /**
   * @param {ObjectId} userId
   * @return {Promise<boolean>}
   */
  async loadFromDBWithUserId(userId) {
    const query = { userId };
    return this.loadFromDBWithQuery(query);
  }

  /**
   * @return {ObjectId}
   */
  getResourceOwnerId() {
    return this.userId;
  }

  /**
   * @param {ObjectId} val
   */
  set userId(val) {
    this.data.userId = val;
  }

  /**
   * @return {ObjectId}
   */
  get userId() {
    return this.data.userId;
  }

  /**
   * @param {number} val
   */
  set amount(val) {
    this.data.amount = val;
  }

  /**
   * @return {number}
   */
  get amount() {
    return this.data.amount;
  }

  /**
   * @param {Currency} val
   */
  set currency(val) {
    this.data.currency = String(val);
  }

  /**
   * @return {Currency}
   */
  get currency() {
    return Currency[this.data.currency];
  }
}

Wallet.SCHEMA = _.assign({
  userId: Schema.id().required(),
  amount: Schema.number().integer().required(),
  currency: Schema.enum(Currency).required(),
}, Model.SCHEMA);

module.exports = Wallet;
