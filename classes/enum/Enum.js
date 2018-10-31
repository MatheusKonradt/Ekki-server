class Enum {
  /**
   * @param {[]|{}} values
   * @return {Enum}
   */
  static enum(...values) {
    const Base = this;
    Base.__ENUMS__ = [];
    for (const name of values) {
      if (name in Base) throw new Error(`duplicated entry ${name}.`);
      Base[name] = new Base(name);
      Object.freeze(Base[name]);
      Base.__ENUMS__.push(name);
    }
    Object.freeze(Base);
    Object.freeze(Base.__ENUMS__);
    return Base;
  }

  /**
   * @return {Array<string>}
   */
  static getEnumValues() {
    return this.__ENUMS__;
  }

  /**
   * @param {string} value
   * @return {Enum}
   */
  static getEnum(value) {
    return this.__ENUMS__[value.toUpperCase()];
  }

  /**
   * @param {string|number|boolean} value
   */
  constructor(value) {
    if (Object.isFrozen(this.constructor)) {
      throw new Error('Cannot dynamically create enums.');
    }
    this.value = value;
  }

  /**
   * @return {string}
   */
  getValue() {
    return this.value;
  }

  /**
   * @return {string}
   */
  [Symbol.toPrimitive]() {
    return this.getValue();
  }
}
module.exports = Enum;
