const ErrorResponse = require('./ResponseError');
const ErrorCode = require('../enum/ErrorCode');

class SchemaError extends ErrorResponse {
  /**
   * @param {SchemaAny} schema
   * @param {Error|string} reason
   */
  constructor(schema, reason) {
    super();
    const label = schema.getLabel();
    const reasonMessage = reason.reason || reason.message || reason;
    this.schema = schema;
    this.setStatus(400);
    this.setCode(ErrorCode.ERR_INVALID_RESOURCE);
    this.setMessage(`<${label}> is invalid because [${reasonMessage}]`);
  }

  /**
   * @return {{code, status, message, reason}}
   */
  toJson() {
    const json = super.toJson();
    json.reason = this.reason;
    return json;
  }
}

module.exports = SchemaError;
