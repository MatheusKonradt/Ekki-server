const { isNumber, isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isNumberMiddleware() {
  return function middleware(value) {
    if (isUndefined(value) || isNumber(value)) return value;
    throw new SchemaError(this, 'must be a number');
  };
}

function maxValueMiddleware(max) {
  return function middleware(value) {
    if (!isUndefined(value) && value > max) {
      throw new SchemaError(this, `max value is ${max}`);
    }
    return value;
  };
}

function minValueMiddleware(min) {
  return function middleware(value) {
    if (!isUndefined(value) && value < min) {
      throw new SchemaError(this, `min value is ${min}`);
    }
    return value;
  };
}

function isIntegerMiddleware() {
  return function middleware(value) {
    if (!isUndefined(value) && !Number.isInteger(value)) {
      throw new SchemaError(this, 'must be an integer');
    }
    return value;
  };
}

class SchemaNumber extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isNumberMiddleware());
  }

  max(value) {
    const schema = this.clone();
    schema.addMiddleware(maxValueMiddleware(value));
    return schema;
  }

  min(value) {
    const schema = this.clone();
    schema.addMiddleware(minValueMiddleware(value));
    return schema;
  }

  integer() {
    const schema = this.clone();
    schema.addMiddleware(isIntegerMiddleware());
    return schema;
  }

  clone() {
    const schema = new SchemaNumber();
    return SchemaNumber.copySchemaProperties(schema, this);
  }
}

module.exports = SchemaNumber;
