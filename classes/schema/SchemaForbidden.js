const { isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isUndefinedMiddleware() {
  return function middleware(value) {
    if (!isUndefined(value)) {
      throw new SchemaError(this, 'is forbidden');
    }
    return value;
  };
}

class SchemaForbidden extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isUndefinedMiddleware());
  }
}

module.exports = SchemaForbidden;
