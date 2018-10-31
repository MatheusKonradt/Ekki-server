const CollectionMongo = require('../database/CollectionMongo');

class EmailVerifications extends CollectionMongo {
  /**
   * @param {App} app
   */
  constructor(app) {
    const db = app.getDatabase('main');
    const collection = db.getCollection('email_verifications');
    super(collection);
  }

}

module.exports = EmailVerifications;
