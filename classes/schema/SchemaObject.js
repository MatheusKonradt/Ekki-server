const { isObject, isArray, isUndefined } = require('util');
const _ = require('lodash');
const SchemaError = require('../error/SchemaError');
const SchemaAny = require('./SchemaAny');

function isObjectMiddleware() {
  return function (value) {
    if ((isUndefined(value) || isObject(value)) && !isArray(value)) return value;
    throw new SchemaError(this, 'must be an object');
  };
}

class SchemaObject extends SchemaAny {
  constructor(props) {
    super();
    this.addMiddleware(isObjectMiddleware());
    this.props = props;
  }

  /**
   * @param {*} rawValue
   * @return {Object}
   */
  validate(rawValue) {
    const value = super.validate(rawValue);

    if (isUndefined(value) || !this.props) {
      return value;
    }

    const validKeys = new Set(Object.keys(this.props));

    for (const key of Object.keys(value)) {
      if (!validKeys.has(key)) {
        throw new SchemaError(this, `child <${key}> is not allowed`);
      }
    }

    const newValue = {};

    for (const [property, schema] of Object.entries(this.props)) {
      try {
        const propertyValue = schema
          .context(this.getContext())
          .label(property)
          .validate(value[property]);

        if (!isUndefined(propertyValue)) {
          newValue[property] = propertyValue;
        }
      } catch (e) {
        if (e instanceof SchemaError) {
          throw new SchemaError(this, e);
        }
        throw e;
      }
    }

    return newValue;
  }

  /**
   * @param {Object} props
   * @return {SchemaAny}
   */
  extend(props) {
    const newProperties = _.assign({}, props, this.props);
    const schema = new SchemaObject(newProperties);
    return SchemaObject.copySchemaProperties(schema, this);
  }

  /**
   * @return {SchemaAny}
   */
  clone() {
    const schema = new SchemaObject(this.props);
    return SchemaObject.copySchemaProperties(schema, this);
  }
}

module.exports = SchemaObject;
