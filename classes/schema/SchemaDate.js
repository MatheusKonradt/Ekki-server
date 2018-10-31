const { isUndefined } = require('util');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isDateMiddleware() {
  return function middleware(value) {
    if (isUndefined(value)) {
      return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new SchemaError(this, 'must be a date');
    }

    return date;
  };
}

class SchemaDate extends SchemaAny {
  constructor() {
    super();
    this.addMiddleware(isDateMiddleware());
  }

  clone() {
    const schema = new SchemaDate(this.propertyPath);
    return SchemaDate.copySchemaProperties(schema, this);
  }
}

module.exports = SchemaDate;
