/* eslint-disable no-unused-vars */
const ErrorFactory = require('../error/ErrorFactory');

/**
 * @interface
 */
class Collection {
  /**
   * @virtual
   * @param {{}} where
   * @param {{}} options
   * @returns {Promise<{}>}
   */
  async find(where, options) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async findOne(where) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} id
   * @returns {Promise<{}>}
   */
  async findById(id) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} data
   * @returns {Promise<{}>}
   */
  async insertOne(data) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {Array<{}>} data
   * @returns {Promise<Array{}>}
   */
  async insertMany(data) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @param {{}} update
   * @return {{}}
   */
  async updateOne(where, update) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {*} id
   * @param {{}} update
   * @return {{}}
   */
  async updateById(id, update) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @param {{}} update
   * @return {{}}
   */
  async updateMany(where, update) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @param {{}} insert
   * @param {{}} update
   * @returns {Promise<{}>}
   */
  async upsert(where, insert, update) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async removeMany(where) { throw ErrorFactory.notImplemented(); }

  /**
   * @virtual
   * @param {{}} where
   * @returns {Promise<{}>}
   */
  async removeOne(where) { throw ErrorFactory.notImplemented(); }

  /**
   * @param {*} id
   * @return {Promise<void>}
   */
  async removeById(id) { throw ErrorFactory.notImplemented(); }
}


module.exports = Collection;
