const CollectionMongo = require('../database/CollectionMongo');

class Users extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('users');
    super(collection);
  }
}

module.exports = Users;
