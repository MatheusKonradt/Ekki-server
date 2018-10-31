const util = require('util');
const ErrorFactory = require('../../classes/error/ErrorFactory');
const ResponseError = require('../../classes/error/ResponseError');
const Response = require('../../classes/api/Response');

module.exports = () => async function parseResponseMiddleware(ctx, next) {
  try {
    await next();
    if (!ctx.body) ErrorFactory.notFound().throw();
    if (!(ctx.body instanceof Response)) throw new Error('Invalid response type');
    ctx.body = ctx.body.toJson();
  } catch (e) {
    if (!(e instanceof ResponseError)) {
      e = ErrorFactory.unknown(e);
    }

    console.error(e);

    ctx.body = e.toJson();
    ctx.status = e.getStatus();
    // TODO log errors to log service
  }
};
