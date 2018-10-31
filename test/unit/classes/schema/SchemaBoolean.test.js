const { expect } = require('chai');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaBoolean = require('../../../../classes/schema/SchemaBoolean');

describe('unit - SchemaBoolean', () => {
  describe('constructor', () => {
    it('should reject anything but boolean values', () => {
      const testValues = ['12', 'true', 'false', null, () => {}];
      for (const testValue of testValues) {
        const schema = new SchemaBoolean();
        expect(() => schema.validate(testValue)).to.throw(SchemaError);
      }
    });

    it('should accept boolean values', () => {
      const testValues = [true, false, undefined];
      for (const testValue of testValues) {
        const schema = new SchemaBoolean();
        expect(() => schema.validate(testValue)).to.not.throw();
      }
    });
  });
});
