const _ = require('lodash');
const SchemaAny = require('./SchemaAny');

function isEqualMiddleware(expectedValue, schema) {
  return function middleware(value) {
    const actualValue = _.get(this.getContext(), this.getTargetingPropertyPath());
    if (actualValue === expectedValue) {
      return schema.validate(value);
    }
    return value;
  };
}

class SchemaWhen extends SchemaAny {
  constructor(propertyPath) {
    super();
    this.setPropertyPath(propertyPath);
  }

  setPropertyPath(propertyPath) {
    this.propertyPath = propertyPath;
    return this;
  }

  getTargetingPropertyPath() {
    return this.propertyPath;
  }

  isEqual(value, subSchema) {
    const schema = this.clone();
    schema.addMiddleware(isEqualMiddleware(value, subSchema));
    return schema;
  }

  clone() {
    const schema = new SchemaWhen(this.propertyPath);
    return SchemaWhen.copySchemaProperties(schema, this);
  }
}

module.exports = SchemaWhen;
