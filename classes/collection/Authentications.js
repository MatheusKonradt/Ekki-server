const CollectionMongo = require('../database/CollectionMongo');

class Authentications extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('authentications');
    super(collection);
  }

}

module.exports = Authentications;
