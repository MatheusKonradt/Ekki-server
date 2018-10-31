const _ = require('lodash');
const { google } = require('googleapis');
const Integration = require('./Integration');

class Google extends Integration {
  /**
     * @private
     * @param {OAuthClient} [oauthClient]
     * @returns {OAuth2Client}
     */
  createNativeOauthClient(oauthClient) {
    console.log(
      this.getClientId(),
      this.getClientSecret(),
      this.getRedirectUrl(),
    );

    const nativeOauthClient = new google.auth.OAuth2(
      this.getClientId(),
      this.getClientSecret(),
      this.getRedirectUrl(),
    );

    if (oauthClient) {
      nativeOauthClient.setCredentials({
        access_token: oauthClient.getAccessToken(),
        refresh_token: oauthClient.getRefreshToken(),
      });
    }

    return nativeOauthClient;
  }

  /**
     * @async
     * @param {string} code
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
  async getTokens(code) {
    console.log('code', code);
    const oauthClient = this.createNativeOauthClient();
    const { tokens } = await oauthClient.getToken(code);
    const { access_token: accessToken, refresh_token: refreshToken } = tokens;
    return { accessToken, refreshToken };
  }

  /**
     * @async
     * @param {OAuthClient} oauthClient
     * @returns {Promise<{email: string, name: string, photo: string}>}
     */
  async getUserData(oauthClient) {
    console.log('oauthClient', oauthClient);
    const nativeOauthClient = this.createNativeOauthClient(oauthClient);
    const plus = google.plus({
      version: 'v1',
      auth: nativeOauthClient,
    });
    const { data } = await plus.people.get({ userId: 'me' });
    return {
      id: data.id,
      email: _.get(_.find(data.emails, { type: 'account' }) || _.first(data.emails), 'value'),
      name: data.displayName,
      photo: _.get(data, 'image.url'),
    };
  }
}

module.exports = Google;
