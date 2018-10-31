const ErrorFactory = require('../error/ErrorFactory');
const DatabaseMongo = require('./DatabaseMongo');

class DatabaseFactory {
  static getDatabaseInstance(databaseType) {
    switch (databaseType) {
      case 'mongo':
        return new DatabaseMongo();
      default:
        throw ErrorFactory.notImplemented();
    }
  }
}

module.exports = DatabaseFactory;
