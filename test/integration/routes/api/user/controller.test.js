const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const User = require('../../../../../classes/model/User');
const Response = require('../../../../../classes/api/Response');
const ResponseError = require('../../../../../classes/error/ResponseError');
const helper = require('../../../../helper');
const controller = require('../../../../../routes/api/users/controller');
const Authentications = require('../../../../../classes/collection/Authentications');
const Users = require('../../../../../classes/collection/Users');
const Actor = require('../../../../../classes/actor/Actor');
const ActorType = require('../../../../../classes/enum/ActorType');
const ErrorCode = require('../../../../../classes/enum/ErrorCode');

describe('controller', () => {
  describe('#signInWithPassAndEmail', () => {
    let user;
    let app;

    before(async () => {
      app = await helper.createTestApp();

      await new Authentications(app).removeMany({ });
      await new Users(app).removeMany({ });

      user = new User(app);
      user.displayName = 'Test User';
      user.email = 'test@mail.abc';
      await user.save();
    });

    it('should successfully patch user\'s displayName', async () => {
      const actor = new Actor();
      actor.setType(ActorType.USER);
      actor.setUserId(user.id);
      const userId = user.id;
      const patch = [{ op: 'replace', path: '/displayName', value: 'The New Name'}];
      const response = await controller.patchUserById(app, actor, userId, patch);
      expect(response).to.be.instanceOf(Response);
      expect(response.resources).to.have.property('user');
      expect(response.resources.user).to.have.property('displayName', 'The New Name');
      expect(response.resources.user).to.have.property('email', 'test@mail.abc');
      expect(await user.loadFromDBWithId(userId)).to.be.equal(true);
      expect(user.displayName).to.be.equal('The New Name');
    });

    it('should fail to patch user\'s displayName with 403 error', async () => {
      const actor = new Actor();
      actor.setType(ActorType.USER);
      actor.setUserId(ObjectId());
      const userId = user.id;
      const patch = [{ op: 'replace', path: '/displayName', value: 'The New Name'}];
      let wasErrorThrown = false;
      let err = null;
      try {
        await controller.patchUserById(app, actor, userId, patch);
      } catch(e) {
        wasErrorThrown = true;
        err = e;
      }
      expect(wasErrorThrown).to.be.equal(true);
      expect(err).to.be.instanceOf(ResponseError);
      expect(err.getCode()).to.be.equal(ErrorCode.ERR_PERMISSION);
    });
  });
});
