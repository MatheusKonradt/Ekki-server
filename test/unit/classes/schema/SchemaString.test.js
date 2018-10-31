const { expect } = require('chai');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaString = require('../../../../classes/schema/SchemaString');

describe('unit - SchemaString', () => {
  describe('constructor', () => {
    it('should not reject strings', () => {
      const testValue = 'heey!';
      const schema = new SchemaString();
      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should reject anything but string values', () => {
      const testValues = [12, true, false, null, 0, () => {}];
      for (const testValue of testValues) {
        const schema = new SchemaString();
        expect(() => schema.validate(testValue)).to.throw(SchemaError);
      }
    });
  });

  describe('max', () => {
    it('should test for maximum string length', () => {
      const smallString = 'hey!';
      const bigString = 'heeeeeey!';
      const schema = new SchemaString();
      const schemaMax = schema.max(8);
      expect(() => schema.validate(bigString)).to.not.throw();
      expect(() => schemaMax.validate(smallString)).to.not.throw();
      expect(() => schemaMax.validate(bigString)).to.throw(SchemaError);
    });
  });

  describe('min', () => {
    it('should test for maximum string length', () => {
      const smallString = 'hey!';
      const bigString = 'heeeeeey!';
      const schema = new SchemaString();
      const schemaMin = schema.min(7);
      expect(() => schema.validate(smallString)).to.not.throw();
      expect(() => schemaMin.validate(bigString)).to.not.throw();
      expect(() => schemaMin.validate(smallString)).to.throw(SchemaError);
    });
  });
});
