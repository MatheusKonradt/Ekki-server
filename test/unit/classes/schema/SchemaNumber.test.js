const { expect } = require('chai');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaNumber = require('../../../../classes/schema/SchemaNumber');

describe('unit - SchemaNumber', () => {
  describe('constructor', () => {
    it('should not reject numbers', () => {
      const testValue = 12;
      const schema = new SchemaNumber();
      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should reject anything but string values', () => {
      const testValues = ['12', true, false, null, () => {}];
      for (const testValue of testValues) {
        const schema = new SchemaNumber();
        expect(() => schema.validate(testValue)).to.throw(SchemaError);
      }
    });
  });

  describe('max', () => {
    it('should test for maximum string length', () => {
      const smallNumber = 1;
      const bigNumber = 200;
      const schema = new SchemaNumber();
      const schemaMax = schema.max(100);
      expect(() => schema.validate(bigNumber)).to.not.throw();
      expect(() => schemaMax.validate(smallNumber)).to.not.throw();
      expect(() => schemaMax.validate(bigNumber)).to.throw(SchemaError);
    });
  });

  describe('min', () => {
    it('should test for maximum string length', () => {
      const smallNumber = 1;
      const bigNumber = 200;
      const schema = new SchemaNumber();
      const schemaMin = schema.min(7);
      expect(() => schema.validate(smallNumber)).to.not.throw();
      expect(() => schemaMin.validate(bigNumber)).to.not.throw();
      expect(() => schemaMin.validate(smallNumber)).to.throw(SchemaError);
    });
  });

  describe('integer', () => {
    it('should reject floating point values', () => {
      const testValues = [1.1, 2.2, Math.PI, 2 / 3, 0.0001];
      for (const testValue of testValues) {
        const schema = new SchemaNumber().integer();
        expect(() => schema.validate(testValue)).to.throw(SchemaError);
      }
    });

    it('should accept integers', () => {
      const testValues = [undefined, 0, 1, 2, 3, 4];
      for (const testValue of testValues) {
        const schema = new SchemaNumber().integer();
        expect(() => schema.validate(testValue)).to.not.throw();
      }
    });
  });
});
