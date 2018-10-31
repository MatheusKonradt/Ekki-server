const _ = require('lodash');
const KoaRouter = require('koa-router');
const schemas = require('./schemas');
const controller = require('./controller');
const auth = require('../../middlewares/authentication');
const AuthProvider = require('../../../classes/enum/AuthProvider');
const ActorFactory = require('../../../classes/actor/ActorFactory');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/auth' });

  router.get('/verification', async (ctx, next) => {
    const { email } = schemas.findEmail.query.validate(ctx.request.query);
    ctx.body = await controller.findOrCreateEmailVerification(app, email);
    await next();
  });

  router.post('/signup', async (ctx, next) => {
    const { email, code } = schemas.createUser.body.validate(ctx.request.body);
    ctx.body = await controller.verifyEmailAndCreateUser(app, email, code);
    await next();
  });

  router.post('/signin', async (ctx, next) => {
    const { code, email, password, provider } = schemas.createAuthToken.body.validate(ctx.request.body);
    if (provider === AuthProvider.GOOGLE) {
      ctx.body = await controller.signInWithThirdPartyProvider(app, provider, code);
    } else {
      ctx.body = await controller.signInWithPassAndEmail(app, email, password);
    }
    await next();
  });

  router.put('/password', auth({ optional: false }), async (ctx, next) => {
    const { password } = schemas.updatePassword.body.validate(ctx.request.body);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.updatePassword(app, actor, password);
    await next();
  });

  return router.middleware();
};
