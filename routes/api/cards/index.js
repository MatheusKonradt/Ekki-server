const _ = require('lodash');
const KoaRouter = require('koa-router');
const schemas = require('./schemas');
const controller = require('./controller');
const auth = require('../../middlewares/authentication');
const ActorFactory = require('../../../classes/actor/ActorFactory');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/cards' });

  router.post('/', auth({ optional: false }), async (ctx, next) => {
    const data = schemas.createCard.body.validate(ctx.request.body);
    const actor = ActorFactory.getActorInstanceFromAuthClaim(ctx.auth);
    ctx.body = await controller.createCard(app, actor, data);
    await next();
  });

  return router.middleware();
};
