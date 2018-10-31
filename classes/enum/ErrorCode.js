const Enum = require('./Enum');

/**
 * @property {ErrorCode} ERR_NOT_FOUND
 * @property {ErrorCode} ERR_PERMISSION
 * @property {ErrorCode} ERR_AUTHENTICATION
 * @property {ErrorCode} ERR_INTERNAL
 * @property {ErrorCode} ERR_INVALID_REQUEST
 * @property {ErrorCode} ERR_INVALID_RESOURCE
 * @property {ErrorCode} ERR_RESOURCE_NOT_FOUND
 * @property {ErrorCode} ERR_NOT_IMPLEMENTED
 * @property {ErrorCode} ERR_NO_LONGER_SUPPORTED
 * @property {ErrorCode} ERR_NOT_ENOUGH_FOUNDS
 */
class ErrorCode extends Enum { }
ErrorCode.enum(
  'ERR_NOT_FOUND',
  'ERR_PERMISSION',
  'ERR_AUTHENTICATION',
  'ERR_INTERNAL',
  'ERR_INVALID_REQUEST',
  'ERR_INVALID_RESOURCE',
  'ERR_RESOURCE_NOT_FOUND',
  'ERR_NOT_IMPLEMENTED',
  'ERR_NO_LONGER_SUPPORTED',
  'ERR_NOT_ENOUGH_FOUNDS',
);

module.exports = ErrorCode;
