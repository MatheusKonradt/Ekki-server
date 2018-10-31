const _ = require('lodash');
const Schema = require('../schema/Schema');
const { Model } = require('../database');
const { Cards } = require('../collection');
const { Currency } = require('../enum');

class Card extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new Cards(app);
    this.setCollection(collection);
    this.setSchema(Card.SCHEMA);
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
  set debit(val) {
    this.data.debit = val;
  }

  /**
   * @return {number}
   */
  get debit() {
    return this.data.debit;
  }

  /**
   * @param {number} val
   */
  set limit(val) {
    this.data.limit = val;
  }

  /**
   * @return {number}
   */
  get limit() {
    return this.data.limit;
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

Card.SCHEMA = _.assign({
  userId: Schema.id().required(),
  debit: Schema.number().integer().required(),
  limit: Schema.number().integer().required(),
  currency: Schema.enum(Currency).required(),
}, Model.SCHEMA);

module.exports = Card;
