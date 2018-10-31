const Enum = require('./Enum');

/**
 * @property {AuthProvider} GOOGLE
 * @property {AuthProvider} EMAIL
 */
class AuthProvider extends Enum { }
AuthProvider.enum('GOOGLE', 'EMAIL');

module.exports = AuthProvider;
