const _ = require('lodash');
const ErrorFactory = require('../../../classes/error/ErrorFactory');
const OAuthClient = require('../../../classes/oauth/OAuthClient');
const Authentication = require('../../../classes/model/Authentication');
const User = require('../../../classes/model/User');
const EmailVerification = require('../../../classes/model/EmailVerification');
const AuthClaim = require('../../../classes/AuthClaim');
const Response = require('../../../classes/api/Response');
const Secret = require('../../../classes/Secret');
const EmailVerificationStatus = require('../../../classes/enum/EmailVerificationStatus');
const AuthProvider = require('../../../classes/enum/AuthProvider');
const Currency = require('../../../classes/enum/Currency');
const Wallet = require('../../../classes/model/Wallet');
const Email = require('../../../classes/Email');

module.exports = {
  /**
   * @async
   * @param {App} app
   * @param {string} provider
   * @param {string} code
   * @returns {Promise<Response>}
   */
  async signInWithThirdPartyProvider(app, provider, code) {
    const oauthClient = new OAuthClient();
    oauthClient.setProviderName(provider);
    oauthClient.setAuthorizationCode(code);
    await oauthClient.login(app);
    const authentication = new Authentication(app);
    const user = new User(app);
    const isUserRegistered = await authentication.loadFromDBWithOauthClient(oauthClient);

    if (!isUserRegistered) {
      // User not found
      user.displayName = oauthClient.getUserData().name;
      user.photoUrl = oauthClient.getUserData().photo;
      user.email = oauthClient.getUserData().email;
      await user.save();

      authentication.userId = user.id;
      authentication.providerId = oauthClient.getUserData().id;
      authentication.providerName = oauthClient.getProviderName();
    } else if ((await user.loadFromDBWithId(authentication.userId)) === false) {
      throw new Error(); // FIXME User was not found, what should we do?
    }

    authentication.refreshToken = oauthClient.getRefreshToken();
    authentication.accessToken = oauthClient.getAccessToken();
    await authentication.save();

    const claim = new AuthClaim(user);

    const response = new Response();
    response.addResource('user', user.toJson());
    response.addResource('token', claim.getToken());
    response.addResource('isNewUser', !isUserRegistered);
    return response;
  },

  /**
   * @param {App} app
   * @param {string} email
   * @param {string} pass
   * @return {Promise<Response>}
   */
  async signInWithPassAndEmail(app, email, pass) {
    const authentication = new Authentication(app);
    const user = new User(app);

    const isUserRegistered = await authentication.loadFromDBWithEmail(email);
    if (!isUserRegistered) {
      throw ErrorFactory.resourceNotFound();
    }

    const secret = new Secret(pass);
    secret.setSalt(authentication.salt);
    const isPasswordMatching = await secret.verify(authentication.password);

    if (!isPasswordMatching) {
      throw ErrorFactory.resourceNotFound();
    }

    const userId = authentication.userId;
    if ((await user.loadFromDBWithId(userId) === false)) {
      throw new Error();
    }

    const claim = new AuthClaim(user);
    const response = new Response();
    response.addResource('user', user.toJson());
    response.addResource('token', claim.getToken());
    response.addResource('isNewUser', false);
    return response;
  },

  /**
   * @param {App} app
   * @param {string} email
   * @return {Promise<Response>}
   */
  async findOrCreateEmailVerification(app, email) {
    const emailVerification = new EmailVerification(app);
    const isVerificationCreated = await emailVerification.loadFromDBWithEmail(email);

    if (!isVerificationCreated) {
      emailVerification.email = email;
      emailVerification.code = _.times(4, () => Math.round(Math.random() * 9)).join('');
      emailVerification.status = EmailVerificationStatus.CREATED;
      await emailVerification.save();
    }

    const mailer = new Email();
    mailer.setRecipient(emailVerification.email);
    mailer.setSubject('Seu código para entrar no Ekki esta aqui!');
    mailer.setText(emailVerification.code);
    await mailer.send();

    const response = new Response();
    response.addResource('emailVerification', emailVerification.setFields(['status', 'email']).toJson());
    return response;
  },

  // TODO - Make this method atomic
  /**
   * @param {App} app
   * @param {string} email
   * @param {string} code
   * @return {Promise<Response>}
   */
  async verifyEmailAndCreateUser(app, email, code) {
    const emailVerification = new EmailVerification(app);
    const isVerificationCreated = await emailVerification.loadFromDBWithEmail(email);

    if (!isVerificationCreated) {
      throw ErrorFactory.resourceNotFound();
    }

    if (emailVerification.code !== code) {
      throw ErrorFactory.badRequest('Invalid code');
    }

    const user = new User(app);
    user.displayName = `user_${_.first(email.split('@'))}`;
    user.email = email;
    await user.save();

    const authentication = new Authentication(app);
    authentication.userId = user.id;
    authentication.providerId = email;
    authentication.providerName = AuthProvider.EMAIL;
    const secret = Secret.getRandomSecret();
    secret.addSalt();
    authentication.password = await secret.hash();
    authentication.salt = secret.getSalt();
    await authentication.save();

    emailVerification.status = EmailVerificationStatus.VERIFIED;
    await emailVerification.save();

    const wallet = new Wallet(app);
    wallet.currency = Currency.BRL;
    wallet.amount = 50000;
    wallet.userId = user.id;
    await wallet.save();

    const claim = new AuthClaim(user);

    const response = new Response();
    response.addResource('user', user.toJson());
    response.addResource('token', claim.getToken());
    return response;
  },

  /**
   * @param app
   * @param actor
   * @param password
   * @return {Promise<Response>}
   */
  async updatePassword(app, actor, password) {
    const authentication = new Authentication(app);
    const wasAuthenticationFound = await authentication.loadFromDBWithUserId(actor.getUserId());
    if (!wasAuthenticationFound) throw new Error('why wouldn\'t it be found?');

    const secret = new Secret(password);
    secret.addSalt();
    authentication.password = await secret.hash();
    authentication.salt = secret.getSalt();
    await authentication.save();

    const response = new Response();
    response.addResource('ok', true);
    return response;
  },
};
