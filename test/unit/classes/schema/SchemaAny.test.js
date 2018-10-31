const { expect } = require('chai');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaAny = require('../../../../classes/schema/SchemaAny');

describe('unit - SchemaAny', () => {
  describe('required', () => {
    it('should reject undefined values', () => {
      const testValue = undefined;
      const schema = new SchemaAny();
      const schemaRequired = schema.required();
      expect(() => schema.validate(testValue)).to.not.throw();
      expect(() => schemaRequired.validate(testValue)).to.throw(SchemaError);
    });

    it('should accept other types of values', () => {
      const testValues = [12, 'test', null, 0, () => {}];
      for (const testValue of testValues) {
        const schema = new SchemaAny();
        const schemaRequired = schema.required();
        expect(() => schema.validate(testValue)).to.not.throw();
        expect(() => schemaRequired.validate(testValue)).to.not.throw();
      }
    });
  });
});
