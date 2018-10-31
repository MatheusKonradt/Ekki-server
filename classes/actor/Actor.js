const ActorType = require('../enum/ActorType');

class Actor {
  constructor() {
  }

  /**
   * @param {ActorType} val
   * @return {Actor}
   */
  setType(val) {
    this.type = val;
    return this;
  }

  /**
   * @return {ActorType}
   */
  getType() {
    return this.type;
  }

  /**
   * @param {ObjectId} val
   * @return {Actor}
   */
  setUserId(val) {
    this.userId = val;
    return this;
  }

  /**
   * @return {ObjectId}
   */
  getUserId() {
    if (this.getType() !== ActorType.USER) {
      throw new Error('tried to get userId of actor that is not a user.');
    }
    return this.userId;
  }
}

module.exports = Actor;
