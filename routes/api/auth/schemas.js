const Schema = require('../../../classes/schema/Schema');
const AuthProviderEnum = require('../../../classes/enum/AuthProvider');

module.exports = {
  createAuthToken: {
    body: Schema.object({
      provider: Schema.enum(AuthProviderEnum).required(),
      code: Schema.when('provider')
        .isEqual(AuthProviderEnum.GOOGLE, Schema.string().required())
        .isEqual(AuthProviderEnum.EMAIL, Schema.forbidden()),
      email: Schema.when('provider')
        .isEqual(AuthProviderEnum.EMAIL, Schema.string().email().required())
        .isEqual(AuthProviderEnum.GOOGLE, Schema.forbidden()),
      password: Schema.when('provider')
        .isEqual(AuthProviderEnum.EMAIL, Schema.string().required())
        .isEqual(AuthProviderEnum.GOOGLE, Schema.forbidden()),
    }),
  },

  findEmail: {
    query: Schema.object({
      email: Schema.string().email().required(),
    }),
  },

  createUser: {
    body: Schema.object({
      code: Schema.string().min(4).max(4).required(),
      email: Schema.string().email().required(),
    }),
  },

  updatePassword: {
    body: Schema.object({
      password: Schema.string().required(),
    }),
  },
};
