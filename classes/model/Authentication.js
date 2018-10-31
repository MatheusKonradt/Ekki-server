const _ = require('lodash');
const Schema = require('../schema/Schema');
const Model = require('../database/Model');
const ErrorFactory = require('../error/ErrorFactory');
const Authentications = require('../collection/Authentications');
const AuthProvider = require('../enum/AuthProvider');

class Authentication extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new Authentications(app);
    this.setCollection(collection);
    this.setSchema(Authentication.SCHEMA);
    this.seal();
  }

  /**
   * @return {ObjectId}
   */
  getResourceOwnerId() {
    return this.userId;
  }

  /**
   * @param {OAuthClient} oauthClient
   * @return {Promise<boolean>}
   */
  async loadFromDBWithOauthClient(oauthClient) {
    const providerName = oauthClient.getProviderName();
    const providerId = oauthClient.getUserData().id;
    if (!providerName || !providerId) ErrorFactory.unknown().throw();
    return this.loadFromDBWithQuery({ providerName, providerId });
  }

  /**
   * @param {string} email
   * @return {Promise<boolean>}
   */
  async loadFromDBWithEmail(email) {
    const query = { providerId: email, providerName: AuthProvider.EMAIL.getValue() };
    return this.loadFromDBWithQuery(query);
  }

  /**
   * @param {ObjectId} userId
   * @return {Promise<boolean>}
   */
  async loadFromDBWithUserId(userId) {
    const query = { userId };
    return this.loadFromDBWithQuery(query);
  }

  /**
   * @param {AuthProvider} value
   */
  set providerName(value) {
    this.data.providerName = value.getValue();
  }


  /**
   * @return {AuthProvider}
   */
  get providerName() {
    return AuthProvider[this.data.providerName];
  }

  /**
   * @param {string} value
   */
  set providerId(value) {
    this.data.providerId = value;
    return this;
  }

  /**
   * @param {ObjectId} value
   */
  set userId(value) {
    this.data.userId = value;
  }

  /**
   * @return {ObjectId}
   */
  get userId() {
    return this.data.userId;
  }

  /**
   * @param {string} value
   */
  set refreshToken(value) {
    this.data.refreshToken = value;
  }

  /**
   * @param {string} value
   */
  set accessToken(value) {
    this.data.accessToken = value;
  }

  /**
   * @return {string}
   */
  get accessToken() {
    return this.data.accessToken;
  }

  /**
   * @param {string} value
   */
  set password(value) {
    this.data.password = value;
  }

  /**
   * @return {string}
   */
  get password() {
    return this.data.password;
  }

  /**
   * @param {string} value
   */
  set salt(value) {
    this.data.salt = value;
  }

  /**
   * @return {string}
   */
  get salt() {
    return this.data.salt;
  }
}

Authentication.SCHEMA = _.assign({
  providerName: Schema.enum(AuthProvider).required(),
  providerId: Schema.string().max(1024).required(),
  accessToken: Schema.string(),
  refreshToken: Schema.string(),
  password: Schema.string(),
  salt: Schema.string(),
  userId: Schema.id().required(),
}, Model.SCHEMA);

module.exports = Authentication;
