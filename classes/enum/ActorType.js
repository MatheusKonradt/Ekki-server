const Enum = require('./Enum');

/**
 * @property {ActorType} USER
 * @property {ActorType} SYSTEM
 */
class ActorType extends Enum { }
ActorType.enum('SYSTEM', 'USER');

module.exports = ActorType;
