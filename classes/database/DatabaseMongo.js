const { MongoClient } = require('mongodb');
const Database = require('./Database');

class DatabaseMongo extends Database {
  getConnectionUrl() {
    let url = 'mongodb://';
    if (this.user) {
      url += this.user;
      if (this.pass) url += `:${this.pass}`;
      url += '@';
    }
    url += `${this.host}:${this.port}`;
    url += `/admin?ssl=${this.ssl}`;
    return url;
  }

  async connect() {
    const url = this.getConnectionUrl();
    console.log(url);
    this.client = await MongoClient.connect(url);
    this.db = this.client.db(this.name);
    return this;
  }

  getCollection(name) {
    const nativeCollection = this.db.collection(name);
    return nativeCollection;
  }

  async close() {
    await this.client.close();
    return this;
  }
}

module.exports = DatabaseMongo;
