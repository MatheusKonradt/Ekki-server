const { expect } = require('chai');
const Schema = require('../../../../classes/schema/Schema');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaArrayTest = require('../../../../classes/schema/SchemaArray');

describe('unit - SchemaArray', () => {
  describe('constructor', () => {
    it('should fail to validate anything but arrays', () => {
      const testValues = [null, { a: 1 }, 1, 0, false, 'testing'];
      for (const value of testValues) {
        const schema = new SchemaArrayTest();
        expect(() => schema.validate(value)).to.throw(SchemaError);
      }
    });

    it('should accept arrays', () => {
      const testValues = [[], [1, 2, 3], ['a', 'abc'], [true, false]];
      for (const value of testValues) {
        const schema = new SchemaArrayTest();
        expect(() => schema.validate(value)).to.not.throw();
      }
    });

    it('should validate array items', () => {
      const schema = Schema.object({
        a: Schema.number().integer(),
        b: Schema.array(Schema.boolean()),
      });

      const testValue = {
        a: 5,
        b: [true, false],
      };

      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should validate array items', () => {
      const schema = Schema.object({
        a: Schema.number().integer(),
        b: Schema.array(Schema.boolean()),
      });

      const testValue = {
        a: 5.8,
        b: [true, 'false'],
      };

      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });
  });

  describe('max', () => {
    it('should accept array with less than "max" length', () => {
      const schema = Schema.array().max(4);
      const testValue = [1, 2, 3];
      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should reject array with more than "max" length', () => {
      const schema = Schema.array().max(4);
      const testValue = [1, 2, 3, 4, 5];
      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });
  });

  describe('min', () => {
    it('should accept array with more than "min" length', () => {
      const schema = Schema.array().min(4);
      const testValue = [1, 2, 3, 4, 5];
      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should reject array with less than "min" length', () => {
      const schema = Schema.array().min(4);
      const testValue = [1, 2, 3];
      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });
  });
});
