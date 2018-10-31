const { isArray, isUndefined } = require('util');
const _ = require('lodash');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isArrayMiddleware() {
  return function middleware(value) {
    if (isUndefined(value) || isArray(value)) return value;
    throw new SchemaError(this, 'must be an array');
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

function minLengthMiddleware(min) {
  return function middleware(value) {
    if (!isUndefined(value) && value.length < min) {
      throw new SchemaError(this, `min length is ${min}`);
    }
    return value;
  };
}

class SchemaArray extends SchemaAny {
  constructor(propertiesSchema) {
    super();
    this.addMiddleware(isArrayMiddleware());
    if (propertiesSchema) {
      this.propertiesSchema = propertiesSchema;
    }
  }

  max(value) {
    const schema = this.clone();
    schema.addMiddleware(maxLengthMiddleware(value));
    return schema;
  }

  min(value) {
    const schema = this.clone();
    schema.addMiddleware(minLengthMiddleware(value));
    return schema;
  }

  validate(rawValue) {
    const value = super.validate(rawValue);

    if (isUndefined(value) || !this.propertiesSchema) {
      return value;
    }

    return _.map(value, (item, i) => this.propertiesSchema
      .context(this.getContext())
      .label(i)
      .validate(item));
  }

  clone() {
    const schema = new SchemaArray(this.propertiesSchema);
    return SchemaArray.copySchemaProperties(schema, this);
  }
}

module.exports = SchemaArray;
