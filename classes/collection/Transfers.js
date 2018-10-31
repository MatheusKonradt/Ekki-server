const CollectionMongo = require('../database/CollectionMongo');

class Transfers extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('transfers');
    super(collection);
  }
}

module.exports = Transfers;
