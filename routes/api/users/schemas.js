const Schema = require('../../../classes/schema/Schema');
const schemas = require('../../schemas');

module.exports = {
  getUserById: {
    params: Schema.object({
      userId: Schema.id().required(),
    }).label('params'),
  },

  patchUserById: {
    params: Schema.object({
      userId: Schema.id().required(),
    }).label('params'),

    body: schemas.patchOperations
  },
};
