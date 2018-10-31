const { isBoolean, isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaString = require('./SchemaString');

function isBooleanMiddleware() {
  return function middleware(value) {
    if (isUndefined(value) || isBoolean(value)) return value;
    throw new SchemaError(this, 'must be a boolean');
  };
}

class SchemaEnum extends SchemaString {
  /**
   * @param {Object<Enum>} Enumerable
   */
  constructor(Enumerable) {
    super();
    this.valid(...Enumerable.getEnumValues());
  }
}

module.exports = SchemaEnum;
