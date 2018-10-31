const CollectionMongo = require('../database/CollectionMongo');

class Wallets extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('wallets');
    super(collection);
  }
}

module.exports = Wallets;
