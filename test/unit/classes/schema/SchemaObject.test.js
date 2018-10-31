const { expect } = require('chai');
const Schema = require('../../../../classes/schema/Schema');
const SchemaError = require('../../../../classes/error/SchemaError');
const SchemaObjectTest = require('../../../../classes/schema/SchemaObject');

describe('unit - SchemaObject', () => {
  describe('constructor', () => {
    const testValue = {
      a: 1,
      b: {
        c: 'a',
        d: 5,
        e: {
          f: true,
        },
      },
    };

    it('should allow any object when no param is passed', () => {
      const schema = new SchemaObjectTest();
      const value = schema.validate(testValue);
      expect(value).to.be.deep.equal(testValue);
    });

    it('should validate object properties correctly', () => {
      const schema = new SchemaObjectTest({
        a: Schema.number(),
        b: Schema.object({
          c: Schema.string(),
          d: Schema.number(),
          e: Schema.object({
            f: Schema.boolean(),
          }),
        }),
      });
      const value = schema.validate(testValue);
      expect(value).to.be.deep.equal(testValue);
    });

    it('should validate object properties correctly (with missing values)', () => {
      const schema = new SchemaObjectTest({
        a: Schema.number(),
        b: Schema.object({
          c: Schema.string(),
          d: Schema.number(),
          e: Schema.object({
            f: Schema.boolean(),
            g: Schema.boolean(),
          }),
        }),
      });
      const value = schema.validate(testValue);
      expect(value).to.be.deep.equal(testValue);
    });

    it('should fail to validate object properties due to invalid type of property', () => {
      const schema = new SchemaObjectTest({
        a: Schema.number(),
        b: Schema.object({
          c: Schema.string(),
          d: Schema.number(),
          e: Schema.object({
            f: Schema.string(),
          }),
        }),
      });
      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });

    it('should fail to validate object properties due to passing something else than an object', () => {
      const schema = new SchemaObjectTest({
        a: Schema.number(),
        b: Schema.object({
          c: Schema.string(),
          d: Schema.number(),
          e: Schema.object({
            f: Schema.string(),
          }),
        }),
      });
      expect(() => schema.validate(true)).to.throw(SchemaError);
    });

    it('should fail to validate object properties due to passing properties that are not allowed', () => {
      const schema = new SchemaObjectTest({
        a: Schema.number(),
        b: Schema.object({
          c: Schema.string(),
          e: Schema.object({
            f: Schema.string(),
          }),
        }),
      });
      expect(() => schema.validate(testValue)).to.throw(SchemaError);
    });
  });
});
