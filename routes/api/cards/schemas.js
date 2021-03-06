const _ = require('lodash');
const Schema = require('../../../classes/schema/Schema');
const schemas = require('../../schemas');
const Transfer = require('../../../classes/model/Transfer');

module.exports = {
  createCard: {
    body: Schema.object({
      userId: Schema.id().required(),
    }),
  },
};
