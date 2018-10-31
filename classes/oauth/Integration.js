
class Integration {
  /**
   * @param {string} value
   * @returns {Integration}
   */
  setClientId(value) {
    this.clientId = value;
    return this;
  }

  /**
   * @returns {string}
   */
  getClientId() {
    return this.clientId;
  }

  /**
   * @param {string} value
   * @returns {Integration}
   */
  setClientSecret(value) {
    this.clientSecret = value;
    return this;
  }

  /**
   * @returns {string}
   */
  getClientSecret() {
    return this.clientSecret;
  }

  /**
   * @param {string} value
   * @returns {Integration}
   */
  setRedirectUrl(value) {
    this.redirectUrl = value;
    return this;
  }

  /**
   * @returns {string}
   */
  getRedirectUrl() {
    return this.redirectUrl;
  }

  /**
   * @virtual
   * @param {OAuthClient} oauthClient
   * @returns {Promise<object>}
   */
  async getUserData(oauthClient) {
    throw new Error();
  }

  /**
   * @virtual
   * @param {string} code
   * @returns {Promise<object>}
   */
  async getTokens(code) {
    throw new Error();
  }
}

module.exports = Integration;
