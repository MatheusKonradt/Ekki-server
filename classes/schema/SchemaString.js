const { isString, isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');
const Utils = require('../Utils');

function isStringMiddleware() {
  return function middleware(value) {
    if (isUndefined(value) || isString(value)) return value;
    throw new SchemaError(this, 'must be a string');
  };
}

function maxLengthMiddleware(max) {
  return function middleware(value) {
    if (!isUndefined(value) && value.length > max) {
      throw new SchemaError(this, `max length is ${max}`);
    }
    return value;
  };
}

function matchValueMiddleware(expression, errorMessage) {
  return function middleware(value) {
    if (isUndefined(value) || value.match(expression)) {
      return value;
    }
    throw new SchemaError(this, errorMessage || 'does not match expected pattern');
  };
}

function minLengthMiddleware(min) {
  return function middleware(value) {
    if (!isUndefined(value) && value.length < min) {
      throw new SchemaError(this, `min length is ${min}`);
    }
    return value;
  };
}

class SchemaString extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isStringMiddleware());
  }

  /**
   * @param value
   * @return {SchemaString}
   */
  max(value) {
    const schema = this.clone();
    schema.addMiddleware(maxLengthMiddleware(value));
    return schema;
  }

  /**
   * @param value
   * @return {SchemaString}
   */
  min(value) {
    const schema = this.clone();
    schema.addMiddleware(minLengthMiddleware(value));
    return schema;
  }

  /**
   * @param value
   * @param errorMessage
   * @return {SchemaString}
   */
  match(value, errorMessage) {
    const schema = this.clone();
    schema.addMiddleware(matchValueMiddleware(value, errorMessage));
    return schema;
  }

  /**
   * @return {SchemaString}
   */
  clone() {
    const schema = new SchemaString();
    SchemaString.copySchemaProperties(schema, this);
    return schema;
  }

  // Regex validations

  /**
   * @return {SchemaString}
   */
  email() {
    return this.match(Utils.REGEX_EMAIL, 'is not a valid email address');
  }

  /**
   * @return {SchemaString}
   */
  url() {
    return this.match(Utils.REGEX_URL, 'Is not a valid url');
  }
}

module.exports = SchemaString;
