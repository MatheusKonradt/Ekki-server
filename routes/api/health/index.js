const _ = require('lodash');
const KoaRouter = require('koa-router');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/health' });

  router.get('/', async (ctx, next) => {
    ctx.body = {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };
    await next();
  });

  return router.middleware();
};
