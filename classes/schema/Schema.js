const SchemaAny = require('./SchemaAny');
const SchemaForbidden = require('./SchemaForbidden');
const SchemaString = require('./SchemaString');
const SchemaNumber = require('./SchemaNumber');
const SchemaBoolean = require('./SchemaBoolean');
const SchemaObject = require('./SchemaObject');
const SchemaArray = require('./SchemaArray');
const SchemaWhen = require('./SchemaWhen');
const SchemaId = require('./SchemaId');
const SchemaDate = require('./SchemaDate');
const SchemaEnum = require('./SchemaEnum');

class Schema {
  /**
   * @return {SchemaAny}
   */
  static any() {
    return new SchemaAny();
  }

  /**
   * @return {SchemaForbidden}
   */
  static forbidden() {
    return new SchemaForbidden();
  }

  /**
   * @param args
   * @return {SchemaString}
   */
  static string(...args) {
    return new SchemaString(...args);
  }

  /**
   * @param args
   * @return {SchemaNumber}
   */
  static number(...args) {
    return new SchemaNumber(...args);
  }

  /**
   * @param args
   * @return {SchemaBoolean}
   */
  static boolean(...args) {
    return new SchemaBoolean(...args);
  }

  /**
   * @param args
   * @return {SchemaObject}
   */
  static object(...args) {
    return new SchemaObject(...args);
  }

  /**
   * @param args
   * @return {SchemaArray}
   */
  static array(...args) {
    return new SchemaArray(...args);
  }

  /**
   * @param args
   * @return {SchemaWhen}
   */
  static when(...args) {
    return new SchemaWhen(...args);
  }

  /**
   * @param args
   * @return {SchemaId}
   */
  static id(...args) {
    return new SchemaId(...args);
  }

  /**
   * @param args
   * @return {SchemaDate}
   */
  static date(...args) {
    return new SchemaDate(...args);
  }

  /**
   * @param {Object<Enum>} Enumerable
   * @return {SchemaEnum}
   */
  static enum(Enumerable) {
    return new SchemaEnum(Enumerable);
  }
}

module.exports = Schema;
