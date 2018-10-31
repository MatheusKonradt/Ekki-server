const Integration = require('./Integration');
const GoogleIntegration = require('./Google');

class IntegrationFactory {

  /**
   *
   * @param {string} name
   * @returns {Integration}
   */
  static getIntegrationByName(name) {
    switch (name) {
      case 'google': return new GoogleIntegration();
      default: throw new Error();
    }
  }
}

module.exports = IntegrationFactory;
