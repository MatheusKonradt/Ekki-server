class OAuthClient {
  constructor() {
    this.setState(OAuthClient.OFFLINE);
  }

  /**
   * @param {string} value
   * @returns {OAuthClient}
   */
  setProviderName(value) {
    this.providerName = value;
    return this;
  }

  /**
   * @returns {string}
   */
  getProviderName() {
    return this.providerName;
  }

  /**
   * @param {number} value
   * @returns {OAuthClient}
   */
  setState(value) {
    this.state = value;
    return this;
  }

  /**
   * @returns {number}
   */
  getState() {
    return this.state;
  }

  /**
   * @param {string} value
   * @returns {OAuthClient}
   */
  setAuthorizationCode(value) {
    this.authorizationCode = value;
    if (this.getState() < OAuthClient.AUTHORIZED) this.setState(OAuthClient.AUTHORIZED);
    return this;
  }

  /**
   * @returns {string}
   */
  getAuthorzationCode() {
    return this.authorizationCode;
  }

  /**
   * @param {string} value
   * @returns {OAuthClient}
   */
  setAccessToken(value) {
    this.accessToken = value;
    return this;
  }

  /**
   * @param {string} value
   * @returns {OAuthClient}
   */
  setRefreshToken(value) {
    this.refreshToken = value;
    return this;
  }

  /**
   * @returns {string}
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * @returns {string}
   */
  getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * @async
   * @param {App} app
   * @returns {Promise<OAuthClient>}
   */
  async login(app) {
    if (this.getState() === OAuthClient.OFFLINE) {
      throw new Error('Client not authorized');
    }

    const integrationProvider = app.getIntegration(this.getProviderName());

    if (this.getState() === OAuthClient.AUTHORIZED) {
      const code = this.getAuthorzationCode();
      const { accessToken, refreshToken } = await integrationProvider.getTokens(code);
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);
    }

    const userData = await integrationProvider.getUserData(this);
    this.setUserData(userData);
    this.setState(OAuthClient.ONLINE);

    return this;
  }

  /**
   * @param {Object} value
   * @return OAuthClient
   */
  setUserData(value) {
    this.userData = value;
    return this;
  }

  /**
   * @return {Object}
   */
  getUserData() {
    return this.userData;
  }
}

OAuthClient.OFFLINE = 0;
OAuthClient.AUTHORIZED = 1;
OAuthClient.ONLINE = 2;

module.exports = OAuthClient;
