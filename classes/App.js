const EventEmitter = require('events');
const Env = require('./Env.js');
const DatabaseFactory = require('./database/DatabaseFactory');
const IntegrationFactory = require('./oauth/IntegrationFactory');
const State = require('./enum/State');

class App extends EventEmitter {
  constructor() {
    super();
    this.databases = {};
    this.integrations = {};
    this.state = State.PENDING;
  }

  /**
   * @return {Promise<void>}
   */
  async waitForReadyState() {
    if (!this.isReady()) {
      await this.setupDatabases();
      await this.setupIntegrations();
      this.state = State.RESOLVED;
    }
  }

  /**
   * @return {boolean}
   */
  isReady() {
    return this.state === State.RESOLVED;
  }

  initializeEnvVars(file) {
    this.vars = new Env(file);
  }

  async setupDatabases() {
    for (const [alias, config] of Object.entries(this.vars.database || {})) {
      await this.addDatabase(alias, config);
    }
    return this;
  }

  async addDatabase(alias, config) {
    const database = DatabaseFactory.getDatabaseInstance(config.type);
    database.setHost(config.host);
    database.setPort(config.port);
    database.setName(config.name);
    database.setUser(config.user);
    database.setPass(config.pass);

    if (config.ssl) {
      database.switchSSLOn();
    } else {
      database.switchSSLOff();
    }

    await database.connect();
    this.databases[alias] = database;
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async setupIntegrations() {
    const googleIntegration = IntegrationFactory.getIntegrationByName('google');
    googleIntegration.setClientId(this.vars.auth.google.clientId);
    googleIntegration.setClientSecret(this.vars.auth.google.clientSecret);
    googleIntegration.setRedirectUrl(this.vars.auth.google.redirectUrl);
    this.addIntegration('google', googleIntegration);
  }

  /**
   * @private
   * @param {string} alias
   * @param {Integration} integration
   */
  addIntegration(alias, integration) {
    this.integrations[alias] = integration;
    return this;
  }

  /**
   *
   * @param {string} alias
   * @returns {Integration}
   */
  getIntegration(alias) {
    const integration = this.integrations[alias];
    if (!integration) throw new Error(`Unknown integration alias '${alias}'.`);
    return integration;
  }

  /**
   * @param {String} alias
   * @return {Database}
   */
  getDatabase(alias) {
    const database = this.databases[alias];
    if (!database) throw new Error(`Unknown database alias '${alias}'.`);
    return database;
  }
}

App.ENV_TEST = 'test';
App.ENV_DEVELOPMENT = 'development';
App.ENV_STAGING = 'staging';
App.ENV_PRODUCTION = 'production';

module.exports = App;
