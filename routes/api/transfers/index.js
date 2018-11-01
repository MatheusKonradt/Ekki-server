const _ = require('lodash');
const KoaRouter = require('koa-router');
const schemas = require('./schemas');
const controller = require('./controller');
const auth = require('../../middlewares/authentication');
const ActorFactory = require('../../../classes/actor/ActorFactory');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/transfers' });

  router.get('/user/:userId', auth({ optional: false }), async (ctx, next) => {
    const { userId } = schemas.listByUserId.params.validate(ctx.params);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.listTransfersByUserId(app, actor, userId);
    await next();
  });

  router.post('/', auth({ optional: false }), async (ctx, next) => {
    const data = schemas.createTransfer.body.validate(ctx.request.body);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.createTransfer(app, actor, data);
    await next();
  });

  return router.middleware();
};
