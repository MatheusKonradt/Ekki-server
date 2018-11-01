const _ = require('lodash');
const Schema = require('../schema/Schema');
const ErrorFactory = require('../error/ErrorFactory');

class Model {
  constructor() {
    this.setData({});
    this.setState(Model.STATE_NEW);
    this.setSafeLoad(true);
    this.fields = null;
  }

  /**
   * @return {Model}
   */
  seal() {
    Object.seal(this);
    return this;
  }

  /**
   * @param {Object} data
   * @return {Object}
   */
  static normalize(data) {
    const id = data._id || data.id;
    return _.assign({ id }, _.omit(data, ['_id']));
  }

  /**
   * @param {Array<string>} fields
   * @return {Model}
   */
  setFields(fields) {
    this.fields = fields;
    return this;
  }

  /**
   * @return {Array<string>}
   */
  getFields() {
    return this.fields;
  }

  /**
   * @param {string} value
   * @return {Model}
   */
  setState(value) {
    this.state = value;
    return this;
  }

  /**
   * @return {string}
   */
  getState() {
    return this.state;
  }

  /**
   * @async
   * @param {ObjectId} id
   * @return {Promise<boolean>}
   */
  async loadFromDBWithId(id) {
    if (!id) throw new Error('id is required');
    const document = await this.collection.findById(id);
    if (!document) return false;
    this.setState(Model.STATE_SAVED);
    this.setData(Model.normalize(document));
    return true;
  }

  /**
   * @protected
   * @async
   * @param {Object} query
   * @return {Promise<boolean>}
   */
  async loadFromDBWithQuery(query) {
    if (_.isEmpty(query)) throw new Error('query must not be empty');
    const document = await this.collection.findOne(query);
    if (!document) {
      if (!this.safeLoad) throw ErrorFactory.resourceNotFound();
      return false;
    }
    this.setState(Model.STATE_SAVED);
    this.setData(Model.normalize(document));
    return true;
  }

  /**
   * @return {Promise<boolean>}
   */
  async reload() {
    if (this.getState() !== Model.STATE_SAVED) return false;
    return this.loadFromDBWithId(this.id);
  }

  /**
   * @param {boolean} val
   * @return {Model}
   */
  setSafeLoad(val) {
    this.safeLoad = val;
    return this;
  }

  /**
   * @param {Object} value
   * @return {Model}
   */
  setData(value) {
    this.data = value;
    return this;
  }

  /**
   * @return {Object}
   */
  getData() {
    return this.data;
  }

  /**
   * @protected
   * @param {CollectionMongo} value
   * @return {Model}
   */
  setCollection(value) {
    this.collection = value;
    return this;
  }

  /**
   * @return {CollectionMongo}
   */
  getCollection() {
    return this.collection;
  }

  /**
   * @param {SchemaAny} schema
   * @return {Model}
   */
  setSchema(schema) {
    this.schema = schema;
    return this;
  }

  /**
   * @return {SchemaAny}
   */
  getSchema() {
    return this.schema;
  }

  /**
   * @return {ObjectId|null}
   */
  getResourceOwnerId() {
    return null;
  }

  /**
   * @param {Date} value
   */
  set modifiedAt(value) {
    this.data.modifiedAt = value;
  }

  /**
   * @return {Date}
   */
  get modifiedAt() {
    return this.data.modifiedAt;
  }

  /**
   * @param {Date} value
   */
  set createdAt(value) {
    this.data.createdAt = value;
  }

  /**
   * @return {Date}
   */
  get createdAt() {
    return this.data.createdAt;
  }

  /**
   * @return {ObjectId}
   */
  get id() {
    return this.data.id;
  }

  /**
   * @return {*}
   */
  verifyData() {
    const schema = this.getSchema();
    const data = this.getData();
    const verifiedData = Schema.object(schema).label(this.constructor.name).context(data).validate(data);
    delete verifiedData.id;
    return verifiedData;
  }

  /**
   * @return {Promise<boolean>} was it created?
   */
  async save() {
    if (this.getState() === Model.STATE_DELETED) {
      throw ErrorFactory.resourceNotFound();
    }

    if (this.getState() === Model.STATE_NEW) {
      const now = new Date();
      this.modifiedAt = now;
      this.createdAt = now;
      const data = this.verifyData();
      this.data.id = await this.collection.insertOne(data);
      this.setState(Model.STATE_SAVED);
      return true;
    }

    if (this.getState() === Model.STATE_SAVED) {
      this.modifiedAt = new Date();
      const update = this.verifyData();
      await this.collection.updateById(this.id, update);
      return false;
    }

    throw new Error(`Unknown state ${this.getState()}`);
  }

  /**
   * @return {Object}
   */
  toJson() {
    const json = _.clone(this.getData());
    const fields = this.getFields();
    if (fields) return _.pick(json, fields);
    return json;
  }
}

Model.STATE_DELETED = 0;
Model.STATE_NEW = 1;
Model.STATE_SAVED = 2;

Model.SCHEMA = {
  id: Schema.id(),
  createdAt: Schema.date().required(),
  modifiedAt: Schema.date().required(),
};

module.exports = Model;
