const ResponseError = require('./ResponseError');
const ErrorCodes = require('../enum/ErrorCode');

class ErrorFactory {
  /**
   * @param {string} message
   * @return {ResponseError}
   */
  static badRequest(message) {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_INVALID_REQUEST);
    err.setMessage(message);
    err.setStatus(400);
    return err;
  }

  /**
   * @param message
   * @return {ResponseError}
   */
  static notFound(message) {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_NOT_FOUND);
    err.setMessage(message);
    err.setStatus(404);
    return err;
  }

  /**
   * @return {ResponseError}
   */
  static notImplemented() {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_NOT_IMPLEMENTED);
    err.setMessage('This method is not implemented.');
    err.setStatus(500);
    return err;
  }

  /**
   * @return {ResponseError}
   */
  static resourceNotFound() {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_RESOURCE_NOT_FOUND);
    err.setStatus(404);
    err.setMessage('The requested resource was not found.');
    return err;
  }

  /**
   * @param {Error} internalError
   * @return {ResponseError}
   */
  static unknown(internalError) {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_INTERNAL);
    err.setMessage('Something went wrong.');
    err.setStatus(500);
    err.setMeta(internalError.stack || internalError.message || internalError);
    return err;
  }

  /**
   * @return {ResponseError}
   */
  static authentication() {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_AUTHENTICATION);
    err.setStatus(401);
    err.setMessage('Authentication required.');
    return err;
  }

  /**
   * @param {Actor} actor
   * @param {Model} model
   * @return {ResponseError}
   */
  static permission(actor, model) {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_PERMISSION);
    err.setStatus(403);
    err.setMessage("Actor doesn't have permission to access specified resource.");
    err.setMeta({ actor, model });
    return err;
  }

  /**
   * @return {ResponseError}
   */
  static notEnoughFounds() {
    const err = new ResponseError();
    err.setCode(ErrorCodes.ERR_NOT_ENOUGH_FOUNDS);
    err.setStatus(400);
    err.setMessage('Not enough founds to realize operation.');
    return err;
  }
}

module.exports = ErrorFactory;
