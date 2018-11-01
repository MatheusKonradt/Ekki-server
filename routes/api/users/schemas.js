const Schema = require('../../../classes/schema/Schema');
const schemas = require('../../schemas');

module.exports = {
  getUserById: {
    params: Schema.object({
      userId: Schema.id().required(),
    }),
    query: Schema.object({
      id: Schema.id(),
    })
  },

  patchUserById: {
    params: Schema.object({
      userId: Schema.id().required(),
    }),

    body: schemas.patchOperations
  },
};
