const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const { ObjectId } = require('mongodb');
const ErrorFactory = require('./error/ErrorFactory');

const EXPIRE_TIME_SECONDS = ms('2 weeks');

class AuthClaim {
  /**
   * @param {string} cert
   * @param {string} pubCert
   */
  static loadCertFiles(cert, pubCert) {
    AuthClaim.CERT = fs.readFileSync(cert);
    AuthClaim.PUB_CERT = fs.readFileSync(pubCert);
  }

  /**
   * @param {User} [user]
   */
  constructor(user) {
    if (user) {
      const now = Date.now() / 1000;
      this.sub = String(user.id);
      this.iat = parseInt(now, 10);
      this.exp = parseInt(now + EXPIRE_TIME_SECONDS, 10);
      this.token = AuthClaim.encode(this.toJson());
    }
  }

  /**
   *
   * @param {Object} data
   * @return {string}
   */
  static encode(data) {
    return jwt.sign(data, AuthClaim.CERT, { algorithm: 'RS256' });
  }

  /**
   * @param {string} token
   * @return {Object}
   */
  static decode(token) {
    return jwt.verify(token, AuthClaim.PUB_CERT, { algorithm: 'RS256' });
  }

  /**
   * @param {string} token
   * @return {AuthClaim}
   */
  static constructFromToken(token) {
    const auth = new AuthClaim();
    try {
      const data = AuthClaim.decode(token);
      auth.iat = data.iat;
      auth.exp = data.exp;
      auth.sub = data.sub;
      auth.token = token;
      return auth;
    } catch (e) {
      const err = ErrorFactory.authentication();
      err.setMeta(e);
      err.throw();
    }
  }

  /**
   *
   * @return {{sub: string, iat: number, exp: number}}
   */
  toJson() {
    return {
      sub: this.sub,
      iat: this.iat,
      exp: this.exp,
    };
  }

  /**
   * @return {string}
   */
  getToken() {
    return this.token;
  }

  /**
   * @return {ObjectId}
   */
  getUserId() {
    return ObjectId(this.sub);
  }
}

module.exports = AuthClaim;
