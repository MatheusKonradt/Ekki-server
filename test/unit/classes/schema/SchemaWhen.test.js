const { expect } = require('chai');
const Schema = require('../../../../classes/schema/Schema');
const SchemaError = require('../../../../classes/error/SchemaError');

describe('unit - SchemaWhen', () => {
  describe('isEqual', () => {
    it('should successfully validate according to context value', () => {
      const testValue = {
        a: 1,
        b: 2,
        c: 3,
      };

      const schema = Schema.object({
        a: Schema.number(),
        b: Schema.number(),
        c: Schema.when('a')
          .isEqual(1, Schema.number()),
      });

      expect(() => schema.validate(testValue)).to.not.throw();
    });

    it('should fail to validate according to context value', () => {
      const testValue = {
        a: 1,
        b: 2,
        c: 3,
      };

      const schema = Schema.object({
        a: Schema.number(),
        b: Schema.number(),
        c: Schema.when('a')
          .isEqual(0, Schema.number())
          .isEqual(1, Schema.string()),
      });

      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });
  });
});
