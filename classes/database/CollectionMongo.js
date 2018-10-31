const { ObjectId } = require('mongodb');
const _ = require('lodash');
const Collection = require('./Collection');

class CollectionMongo extends Collection {
  /**
   * @param {*} mongoCollections
   */
  constructor(mongoCollections) {
    super();
    this.col = mongoCollections;
  }

  /**
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async find(where) {
    const result = await this.col.find(where);
    return result.toArray();
  }

  /**
   * @param {*} id
   * @returns {Promise<{}>}
   */
  async findById(id) {
    return this.findOne({ _id: ObjectId(id) });
  }

  /**
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async findOne(where) {
    return this.col.findOne(where);
  }

  /**
   * @param {{}} data
   * @returns {Promise<undefined>}
   */
  async insertOne(data) {
    const insertData = _.clone(data);
    await this.col.insertOne(insertData);
    return insertData._id;
  }

  /**
   * @param {{}} data
   * @returns {Promise<Array{}>}
   */
  async insertMany(data) {
    const insertData = _.cloneDeep(data);
    await this.col.insertMany(data);
    return insertData; // FIXME should return array of ids
  }

  /**
   * @param {} where
   * @returns {Promise<{}>}
   */
  async removeMany(where) {
    return this.col.removeMany(where);
  }

  /**
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async removeOne(where) {
    return this.col.removeOne(where);
  }

  /**
   * @param {{}} where
   * @param {{}} insert
   * @param {{}} [update]
   * @returns {Promise<{}>}
   */
  async upsert(where, insert, update) {
    const operation = {};
    operation.$setOnInsert = insert;
    if (update) operation.$set = update;
    return this.col.updateOne(where, operation, { upsert: true });
  }

  /**
   * @param {*} id
   * @param {{}} update
   * @return {Promise<undefined>}
   */
  async updateById(id, update) {
    return this.updateOne({ _id: ObjectId(id) }, update);
  }

  /**
   * @param {{}} where
   * @param {{}} update
   * @return {Promise<void>}
   */
  async updateMany(where, update) {
    const operation = { $set: update };
    return this.col.updateMany(where, operation);
  }

  /**
   * @param {{}} where
   * @param {{}} update
   * @return {Promise<{}>}
   */
  async updateOne(where, update) {
    const operation = { $set: update };
    return this.col.updateOne(where, operation);
  }
}

module.exports = CollectionMongo;
