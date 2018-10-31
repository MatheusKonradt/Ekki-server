const Enum = require('./Enum');

/**
 * @property {State} PENDING
 * @property {State} RESOLVED
 * @property {State} REJECTED
 */
class State extends Enum { }
State.enum('PENDING', 'RESOLVED', 'REJECTED');

module.exports = State;
