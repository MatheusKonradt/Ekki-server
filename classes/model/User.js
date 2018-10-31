const _ = require('lodash');
const Schema = require('../schema/Schema');
const Model = require('../database/Model');
const Users = require('../collection/Users');

class User extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new Users(app);
    this.setCollection(collection);
    this.setSchema(User.SCHEMA);
    this.seal();
  }

  /**
   * @return {ObjectId}
   */
  getResourceOwnerId() {
    return this.id;
  }

  /**
   * @param {string} value
   */
  set displayName(value) {
    this.data.displayName = value;
  }

  /**
   * @return {string}
   */
  get displayName() {
    return this.data.displayName;
  }

  /**
   * @param {string} value
   */
  set photoUrl(value) {
    this.data.photoUrl = value;
  }

  /**
   * @return {string}
   */
  get photoUrl() {
    return this.data.photoUrl;
  }

  /**
   * @param {string} value
   */
  set email(value) {
    this.data.email = value;
  }

  /**
   * @return {string}
   */
  get email() {
    return this.data.email;
  }
}

User.SCHEMA = _.assign({
  displayName: Schema.string().max(512).min(3).required(),
  photoUrl: Schema.string().url(),
  email: Schema.string().email(),
}, Model.SCHEMA);

module.exports = User;
