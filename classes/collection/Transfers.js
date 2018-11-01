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

  async findByUserId(userId) {
    const pipeline = [
      { $match: { $or: [{ fromUserId: userId }, { toUserId: userId }] } },
      {
        $lookup: {
          from: 'users', localField: 'fromUserId', foreignField: '_id', as: 'fromUser',
        },
      },
      {
        $lookup: {
          from: 'users', localField: 'toUserId', foreignField: '_id', as: 'toUser',
        },
      },
      { $unwind: '$fromUser' },
      { $unwind: '$toUser' },
    ];

    return this.col.aggregate(pipeline).toArray();
  }
}

module.exports = Transfers;
