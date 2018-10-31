const _ = require('lodash');
const Schema = require('../schema/Schema');
const Model = require('../database/Model');
const EmailVerifications = require('../collection/EmailVerifications');
const EmailVerificationStatus = require('../enum/EmailVerificationStatus');

class EmailVerification extends Model {
  /**
   * @param {App} app
   */
  constructor(app) {
    super();
    const collection = new EmailVerifications(app);
    this.setCollection(collection);
    this.setSchema(EmailVerification.SCHEMA);
    this.seal();
  }

  /**
   * @param {string} email
   * @return {Promise<boolean>}
   */
  loadFromDBWithEmail(email) {
    const query = { email };
    return this.loadFromDBWithQuery(query);
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

  /**
   * @param {string} value
   */
  set code(value) {
    this.data.code = value;
  }

  /**
   * @return {string}
   */
  get code() {
    return this.data.code;
  }

  /**
   * @param {EmailVerificationStatus} value
   */
  set status(value) {
    this.data.status = value.getValue();
  }

  /**
   * @return {EmailVerificationStatus}
   */
  get status() {
    return EmailVerificationStatus[this.data.status]
  }
}

EmailVerification.SCHEMA = _.assign({
  code: Schema.string().min(4).max(4).required(),
  email: Schema.string().email(),
  status: Schema.enum(EmailVerificationStatus).required(),
}, Model.SCHEMA);

module.exports = EmailVerification;
