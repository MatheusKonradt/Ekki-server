const _ = require('lodash');
const Schema = require('../schema/Schema');
const Model = require('../database/Model');
const Transfers = require('../collection/Transfers');
const Currency = require('../enum/Currency');

class Transfer extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new Transfers(app);
    this.setCollection(collection);
    this.setSchema(Transfer.SCHEMA);
    this.seal();
  }

  /**
   * @return {ObjectId}
   */
  getResourceOwnerId() {
    return this.userId;
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

  /**
   * @param {ObjectId} val
   */
  set fromUserId(val) {
    this.data.fromUserId = val;
  }

  /**
   * @return {ObjectId}
   */
  get fromUserId() {
    return this.data.fromUserId;
  }

  /**
   * @param {ObjectId} val
   */
  set toUserId(val) {
    this.data.toUserId = val;
  }

  /**
   * @return {ObjectId}
   */
  get toUserId() {
    return this.data.toUserId;
  }

  /**
   * @param {boolean} val
   */
  set allowCreditCardUsage(val) {
    this.data.allowCreditCardUsage = val;
  }

  /**
   * @return {boolean}
   */
  get allowCreditCardUsage() {
    return this.data.allowCreditCardUsage;
  }
}

Transfer.SCHEMA = _.assign({
  fromUserId: Schema.id().required(),
  toUserId: Schema.id().required(),
  amount: Schema.number().integer().required(),
  currency: Schema.enum(Currency).required(),
  allowCreditCardUsage: Schema.boolean(Currency),
}, Model.SCHEMA);

module.exports = Transfer;
