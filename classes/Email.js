const sgMail = require('@sendgrid/mail');

class Email {
  /**
   * @param {App} app
   */
  static initialize(app) {
    sgMail.setApiKey(app.vars.sendgrid.key);
  }

  /**
   * @param val
   * @return {Email}
   */
  setRecipient(val) {
    this.recipient = val;
    return this;
  }

  /**
   * @param val
   * @return {Email}
   */
  setSubject(val) {
    this.subject = val;
    return this;
  }

  /**
   * @param val
   * @return {Email}
   */
  setText(val) {
    this.text = val;
    return this;
  }

  getMessage() {
    return {
      to: this.recipient,
      from: 'ekki@ekki.com',
      subject: this.subject,
      text: this.text,
    };
  }

  /**
   * @return {Promise<[ClientResponse , {}]>}
   */
  async send() {
    const msg = this.getMessage();
    return sgMail.send(msg);
  }
}

module.exports = Email;