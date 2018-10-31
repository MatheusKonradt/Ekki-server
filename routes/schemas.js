const Schema = require('../classes/schema/Schema');

module.exports = {
  patchOperation: Schema.object({
    op: Schema.string().valid('replace', 'add', 'remove').required(),
    path: Schema.string().required(),
    value: Schema.when('op')
      .isEqual('replace', Schema.any().required())
      .isEqual('add', Schema.any().required())
      .isEqual('remove', Schema.forbidden()),
  }),

  patchOperations: Schema.array(this.patchOperation),
};
