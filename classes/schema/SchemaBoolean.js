const { isBoolean, isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isBooleanMiddleware() {
  return function middleware(value) {
    if (isUndefined(value) || isBoolean(value)) return value;
    throw new SchemaError(this, 'must be a boolean');
  };
}

class SchemaBoolean extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isBooleanMiddleware());
  }
}

module.exports = SchemaBoolean;
