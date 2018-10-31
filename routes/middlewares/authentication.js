const AuthClaim = require('../../classes/AuthClaim');
const ErrorFactory = require('../../classes/error/ErrorFactory');

module.exports = ({ optional = false } = {}) => function authenticationMiddleware(ctx, next) {
  const token = ctx.request.headers.authorization;

  if (!token) {
    if (!optional) ErrorFactory.authentication().throw();
    return next();
  }

  ctx.auth = AuthClaim.constructFromToken(token);
  return next();
};
