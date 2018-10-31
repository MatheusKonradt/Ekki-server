const { isUndefined } = require('util');
const ErrorSchema = require('../error/SchemaError');

function isRequiredMiddleware() {
  return function middleware(value) {
    if (isUndefined(value)) throw new ErrorSchema(this, 'it is required');
    return value;
  };
}

class SchemaAny {
  required() {
    const schema = this.clone();
    schema.addMiddleware(isRequiredMiddleware());
    return schema;
  }

  constructor() {
    this.middlewares = [];
    this.setLabel('input');
  }

  /**
   * @param {Object} context
   * @return {SchemaAny}
   */
  context(context) {
    const schema = this.clone();
    schema.setContext(context);
    return schema;
  }

  setContext(context) {
    this._context = context;
    return this;
  }

  getContext() {
    return this._context;
  }

  /**
   * @param {string} label
   * @return {SchemaAny}
   */
  label(label) {
    const schema = this.clone();
    schema.setLabel(label);
    return schema;
  }

  /**
   * @param {string} label
   * @return {SchemaAny}
   */
  setLabel(label) {
    this._label = label;
    return this;
  }

  getLabel() {
    return this._label;
  }

  setAllowedValues(allowedValues) {
    this.allowedValues = allowedValues;
    return this;
  }

  setValidValues(validValues) {
    this.validValues = validValues;
    return this;
  }

  /**
   * @param {...string} values
   * @return {SchemaAny}
   */
  allow(...values) {
    const schema = this.clone();
    schema.setAllowedValues(new Set([...values]));
    return schema;
  }

  /**
   * @param {...string} values
   * @return {SchemaAny}
   */
  valid(...values) {
    const schema = this.clone();
    schema.setValidValues(new Set([...values]));
    return schema;
  }

  addMiddleware(...middleware) {
    this.middlewares.push(...middleware);
    return this;
  }

  /**
   * @param {*} value
   * @return {*}
   */
  validate(value) {
    if (this.getContext() === undefined) {
      this.setContext(value);
    }

    if (this.allowedValues && this.allowedValues.has(value)) {
      return value;
    }

    if (this.validValues) {
      if (this.validValues.has(value)) {
        return value;
      }
      throw new ErrorSchema(this, `must be one of (${[...this.validValues]})`);
    }

    return this.middlewares.reduce((acc, middleware) => middleware.call(this, acc), value);
  }

  /**
   * @protected
   * @return {SchemaAny}
   */
  clone() {
    const schema = new SchemaAny();
    return SchemaAny.copySchemaProperties(schema, this);
  }

  /**
   * @protected
   * @param {SchemaAny} schemaA
   * @param {SchemaAny} schemaB
   * @return {SchemaAny}
   */
  static copySchemaProperties(schemaA, schemaB) {
    schemaA.setLabel(schemaB.getLabel());
    schemaA.setContext(schemaB.getContext());
    schemaA.addMiddleware(...schemaB.middlewares);
    schemaA.setValidValues(schemaB.validValues);
    schemaA.setAllowedValues(schemaB.allowedValues);
    return schemaA;
  }
}

module.exports = SchemaAny;
