class ResponseError extends Error {
  /**
   * @param {Object} [props]
   * @param {ErrorCode} [props.code]
   * @param {string} [props.message]
   * @param {number} [props.status]
   */
  constructor(props = {}) {
    const { message, code, status } = props;
    super();
    this.setMessage(message);
    this.setCode(code);
    this.setStatus(status);
  }

  /**
   * @param {string} value
   * @return {ResponseError}
   */
  setMessage(value) {
    this.message = value;
    return this;
  }

  /**
   * @return {string}
   */
  getMessage() {
    return this.message;
  }

  /**
   * @param {ErrorCode} code
   * @return {ResponseError}
   */
  setCode(code) {
    this.code = code;
    return this;
  }

  /**
   * @param {number} status
   * @return {ResponseError}
   */
  setStatus(status) {
    this.status = status;
    return this;
  }

  /**
   * @return {number}
   */
  getStatus() {
    return this.status;
  }

  /**
   * @return {ErrorCode}
   */
  getCode() {
    return this.code;
  }

  /**
   * @param {*} meta
   * @return {ResponseError}
   */
  setMeta(meta) {
    this.meta = meta;
    return this;
  }

  getMeta() {
    return this.meta;
  }

  /**
   * @return {{code: string, status: number, message: string}}
   */
  toJson() {
    const code = this.getCode();
    return {
      code: code && code.getValue(),
      status: this.getStatus(),
      message: this.getMessage(),
    };
  }

  throw() {
    // eslint-disable-next-line no-throw-literal
    throw this;
  }
}

module.exports = ResponseError;
