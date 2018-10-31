const Enum = require('./Enum');

/**
 * @property {EmailVerificationStatus} CREATED
 * @property {EmailVerificationStatus} VERIFIED
 */
class EmailVerificationStatus extends Enum { }
EmailVerificationStatus.enum('CREATED', 'VERIFIED');

module.exports = EmailVerificationStatus;
