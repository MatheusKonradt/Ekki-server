const Actor = require('./Actor');
const ActorType = require('../enum/ActorType');

class ActorFactory {

  /**
   * @param {AuthClaim} authClaim
   * @return {Actor}
   */
  static getActorInstanceFromAuthClaim(authClaim) {
    const actor = new Actor();
    actor.setType(ActorType.USER);
    actor.setUserId(authClaim.getUserId());
    return actor;
  }

  /**
   * @return {Actor}
   */
  static getActorInstanceForSystem() {
    const actor = new Actor();
    actor.setType(ActorType.SYSTEM);
    return actor;
  }
}

module.exports = ActorFactory;