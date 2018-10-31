const _ = require('lodash');
const KoaRouter = require('koa-router');
const schemas = require('./schemas');
const controller = require('./controller');
const auth = require('../../middlewares/authentication');
const ActorFactory = require('../../../classes/actor/ActorFactory');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/users' });

  router.get('/:userId', auth({ optional: false }), async (ctx, next) => {
    const { userId } = schemas.getUserById.params.validate(ctx.params);
    ctx.body = await controller.getUserById(app, userId);
    await next();
  });

  router.get('/:userId/wallet', auth({ optional: false }), async (ctx, next) => {
    const { userId } = schemas.getUserById.params.validate(ctx.params);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.getUserWallet(app, actor, userId);
    await next();
  });

  router.get('/:userId/card', auth({ optional: false }), async (ctx, next) => {
    const { userId } = schemas.getUserById.params.validate(ctx.params);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.getUserCard(app, actor, userId);
    await next();
  });

  router.patch('/:userId', auth({ optional: false }), async(ctx, next) => {
    const { userId } = schemas.patchUserById.params.validate(ctx.params);
    const patch = schemas.patchUserById.body.validate(ctx.request.body);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.patchUserById(app, actor, userId, patch);
    await next();
  });

  return router.middleware();
};
