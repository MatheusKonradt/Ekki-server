const _ = require('lodash');
const KoaRouter = require('koa-router');
const schemas = require('./schemas');
const controller = require('./controller');
const auth = require('../../middlewares/authentication');
const ActorFactory = require('../../../classes/actor/ActorFactory');

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/cards' });


  return router.middleware();
};
