const crypto = require('crypto');
const argon2 = require('argon2');

class Secret {

  /**
   * @return {Secret}
   */
  static getRandomSecret() {
    const value = crypto.randomBytes(16).toString('hex');
    return new Secret(value);
  }

  /**
   * @param {*} value
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * @return {Secret}
   */
  addSalt() {
    const salt = crypto.randomBytes(48).toString('hex');
    this.setSalt(salt);
    return this;
  }

  /**
   * @param {string} value
   * @return {Secret}
   */
  setSalt(value) {
    this.salt = value;
    return this;
  }

  /**
   * @return {string}
   */
  getSalt() {
    return this.salt;
  }

  /**
   * @return {string}
   */
  getSaltedValue() {
    return this.value + (this.getSalt() || '');
  }

  /**
   * @return {Promise<string>}
   */
  async hash() {
    const value = this.getSaltedValue();
    return argon2.hash(value);
  }

  /**
   * @param hash
   * @return {Promise<boolean>}
   */
  async verify(hash) {
    const value = this.getSaltedValue();
    return argon2.verify(hash, value);
  }
}

module.exports = Secret;
