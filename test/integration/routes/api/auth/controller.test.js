const { expect } = require('chai');
const User = require('../../../../../classes/model/User');
const Authentication = require('../../../../../classes/model/Authentication');
const EmailVerification = require('../../../../../classes/model/EmailVerification');
const Response = require('../../../../../classes/api/Response');
const ResponseError = require('../../../../../classes/error/ResponseError');
const ErrorCode = require('../../../../../classes/enum/ErrorCode');
const ActorType = require('../../../../../classes/enum/ActorType');
const helper = require('../../../../helper');
const Secret = require('../../../../../classes/Secret');
const AuthProvider = require('../../../../../classes/enum/AuthProvider');
const controller = require('../../../../../routes/api/auth/controller');
const AuthClaim = require('../../../../../classes/AuthClaim');
const Authentications = require('../../../../../classes/collection/Authentications');
const EmailVerifications = require('../../../../../classes/collection/EmailVerifications');
const Users = require('../../../../../classes/collection/Users');
const EmailVerificationStatus = require('../../../../../classes/enum/EmailVerificationStatus');
const Actor = require('../../../../../classes/actor/Actor');

describe('controller', () => {
  describe('#signInWithPassAndEmail', () => {
    let user;
    let app;
    let authentication;

    before(async () => {
      app = await helper.createTestApp();

      await new Authentications(app).removeMany({ });
      await new EmailVerifications(app).removeMany({ });
      await new Users(app).removeMany({ });

      const secret = new Secret('1234');
      secret.addSalt();

      user = new User(app);
      user.displayName = 'Test User';
      user.email = 'test@mail.abc';
      await user.save();

      authentication = new Authentication(app);
      authentication.userId = user.id;
      authentication.password = await secret.hash();
      authentication.salt = secret.getSalt();
      authentication.providerName = AuthProvider.EMAIL;
      authentication.providerId = 'test@mail.abc';
      await authentication.save();
    });

    it('should successfully authenticate with email and password', async () => {
      const email = 'test@mail.abc';
      const pass = '1234';
      const response = await controller.signInWithPassAndEmail(app, email, pass);
      expect(response).to.be.an.instanceOf(Response);
      expect(response.resources.user).to.be.deep.equal(user.toJson());
      expect(response.resources.token).to.be.a('string');
      const claim = AuthClaim.constructFromToken(response.resources.token);
      expect(claim).to.have.property('sub', user.id.toString());
    });

    it('should fail to authenticate with an email that is not registered', async () => {
      const email = 'test-fail@mail.abc';
      const pass = '1234';
      let err;
      try {
        await controller.signInWithPassAndEmail(app, email, pass);
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an.instanceOf(ResponseError);
      expect(err.getCode()).to.be.equal(ErrorCode.ERR_RESOURCE_NOT_FOUND);
    });

    it('should fail to authenticate with an wrong password', async () => {
      const email = 'test@mail.abc';
      const pass = '1234-fail';
      let err;
      try {
        await controller.signInWithPassAndEmail(app, email, pass);
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an.instanceOf(ResponseError);
      expect(err.getCode()).to.be.equal(ErrorCode.ERR_RESOURCE_NOT_FOUND);
    });
  });

  describe('#findOrCreateEmailVerification', () => {
    let app;

    before(async () => {
      app = await helper.createTestApp();
      await new EmailVerifications(app).removeMany({ });
    });

    it('should create a new emailVerification document', async () => {
      const email = 'test@mail.abc';
      const response = await controller.findOrCreateEmailVerification(app, email);
      expect(response).to.be.an.instanceOf(Response);
      expect(response.resources).to.have.property('emailVerification');
      expect(response.resources.emailVerification).to.have.property('status', EmailVerificationStatus.CREATED.getValue());
      const emailVerification = new EmailVerification(app);
      await emailVerification.loadFromDBWithEmail(email);
      expect(emailVerification.email).to.be.equal(email);
      expect(emailVerification.status).to.be.equal(EmailVerificationStatus.CREATED);
      expect(/\d{4}/.test(emailVerification.code)).to.be.equal(true);
    });
  });

  describe('#verifyEmailAndCreateUser', () => {
    let app;

    before(async () => {
      app = await helper.createTestApp();
      const emailVerification = new EmailVerification(app);
      emailVerification.email = 'test123@test.asd';
      emailVerification.code = '1234';
      emailVerification.status = EmailVerificationStatus.CREATED;
      await emailVerification.save();
    });

    it('should reject verification with an invalid code', async () => {
      const email = 'test123@test.asd';
      const code = '4567';
      let wasErrorTrown = false;
      let err;
      try {
        await controller.verifyEmailAndCreateUser(app, email, code);
      } catch (e) {
        wasErrorTrown = true;
        err = e;
      }
      expect(wasErrorTrown).to.be.equal(true);
      expect(err).to.be.an.instanceOf(ResponseError);
      expect(err.getCode()).to.be.equal(ErrorCode.ERR_INVALID_REQUEST);
    });

    it('should reject verification with an invalid email', async () => {
      const email = 'wrong-email@test.asd';
      const code = '1234';
      let wasErrorTrown = false;
      let err;
      try {
        await controller.verifyEmailAndCreateUser(app, email, code);
      } catch (e) {
        wasErrorTrown = true;
        err = e;
      }
      expect(wasErrorTrown).to.be.equal(true);
      expect(err).to.be.an.instanceOf(ResponseError);
      expect(err.getCode()).to.be.equal(ErrorCode.ERR_RESOURCE_NOT_FOUND);
    });

    it('should set emailVerification status to VERIFIED', async () => {
      const email = 'test123@test.asd';
      const code = '1234';
      const response = await controller.verifyEmailAndCreateUser(app, email, code);
      expect(response).to.be.an.instanceOf(Response);
      expect(response.resources).to.have.property('user');
      expect(response.resources.user).to.have.property('displayName', 'user_test123');
      expect(response.resources.user).to.have.property('email', 'test123@test.asd');
      expect(response.resources.user).to.have.property('createdAt');
      expect(response.resources.user).to.have.property('modifiedAt');
      expect(response.resources.user).to.have.property('id');
      const emailVerification = new EmailVerification(app);
      expect(await emailVerification.loadFromDBWithEmail('test123@test.asd')).to.be.equal(true);
      expect(emailVerification.status).to.be.equal(EmailVerificationStatus.VERIFIED);
    });
  });

  describe('#updatePassword', () => {
    let app;
    let user;
    let authentication;

    before(async () => {
      app = await helper.createTestApp();

      await new Authentications(app).removeMany({ });
      await new EmailVerifications(app).removeMany({ });
      await new Users(app).removeMany({ });

      const secret = new Secret('1234');
      secret.addSalt();

      user = new User(app);
      user.displayName = 'Test User';
      user.email = 'test@mail.abc';
      await user.save();

      authentication = new Authentication(app);
      authentication.userId = user.id;
      authentication.password = await secret.hash();
      authentication.salt = secret.getSalt();
      authentication.providerName = AuthProvider.EMAIL;
      authentication.providerId = 'test@mail.abc';
      await authentication.save();
    });

    it('should successfully update a password', async () => {
      const actor = new Actor();
      actor.setType(ActorType.USER);
      actor.setUserId(user.id);
      const response = await controller.updatePassword(app, actor, 'abc');
      expect(response).to.be.instanceOf(Response);
      const oldPassword = authentication.password;
      await authentication.reload();
      const newPassword = authentication.password;
      expect(oldPassword).to.not.be.equal(newPassword);
    });
  });
});
