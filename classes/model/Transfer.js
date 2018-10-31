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

  /**
   * @param {ObjectId} val
   */
  set fromWalletId(val) {
    this.data.fromWalletId = val;
  }

  /**
   * @return {ObjectId}
   */
  get fromWalletId() {
    return this.data.fromWalletId;
  }

  /**
   * @param {ObjectId} val
   */
  set toWalletId(val) {
    this.data.toWalletId = val;
  }

  /**
   * @return {ObjectId}
   */
  get toWalletId() {
    return this.data.toWalletId;
  }
}

Transfer.SCHEMA = _.assign({
  userId: Schema.id().required(),
  fromWalletId: Schema.id().required(),
  toWalletId: Schema.id().required(),
  amount: Schema.number().integer().required(),
  currency: Schema.enum(Currency).required(),
}, Model.SCHEMA);

module.exports = Transfer;
