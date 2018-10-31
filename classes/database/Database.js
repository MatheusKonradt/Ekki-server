class Database {
  setHost(value) {
    this.host = value;
    return this;
  }

  setPass(pass) {
    this.pass = pass;
    return this;
  }

  setPort(value) {
    this.port = value;
    return this;
  }

  setName(value) {
    this.name = value;
    return this;
  }

  switchSSLOn() {
    this.ssl = true;
    return this;
  }

  switchSSLOff() {
    this.ssl = false;
    return this;
  }

  setUser(user) {
    this.user = user;
    return this;
  }

  /**
   * @virtual
   * @param {string} name
   * @return {Collection}
   */
  // eslint-disable-next-line no-unused-vars
  getCollection(name) {

  }
}

module.exports = Database;
