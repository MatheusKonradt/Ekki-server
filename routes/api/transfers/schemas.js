const _ = require('lodash');
const Schema = require('../../../classes/schema/Schema');
const schemas = require('../../schemas');
const Transfer = require('../../../classes/model/Transfer');

module.exports = {
  createTransfer: {
    body: Schema.object(_.pick(Transfer.SCHEMA, ['fromWalletId', 'toWalletId', 'amount', 'currency'])),
  },

};
