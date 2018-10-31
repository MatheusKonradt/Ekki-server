/* eslint-disable global-require */
const KoaRouter = require('koa-router');

module.exports = (app) => {
  const router = new KoaRouter();
  router.use(require('./api/health')(app));
  router.use(require('./api/auth')(app));
  router.use(require('./api/users')(app));
  router.use(require('./api/wallets')(app));
  router.use(require('./api/transfers')(app));
  router.use(require('./api/cards')(app));
  return router.middleware();
};
