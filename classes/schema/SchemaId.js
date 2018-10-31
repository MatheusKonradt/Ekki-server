const { isUndefined } = require('util');
const { ObjectId } = require('mongodb');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isBooleanMiddleware() {
  return function middleware(value) {
    if (isUndefined(value)) return value;
    try {
      return ObjectId(value);
    } catch (e) {
      throw new SchemaError(this, 'must be an ID');
    }
  };
}

class SchemaId extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isBooleanMiddleware());
  }
}

module.exports = SchemaId;
