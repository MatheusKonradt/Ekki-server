const CollectionMongo = require('../database/CollectionMongo');

class Cards extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('cards');
    super(collection);
  }
}

module.exports = Cards;
