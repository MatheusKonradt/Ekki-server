const path = require('path');
const { expect } = require('chai');
const Env = require('../../../classes/Env');

describe('unit - Env', () => {
  describe('constructor', () => {
    it('Should load a ini file correctly', () => {
      const iniFilePath = path.join(__dirname, './test.ini');
      const env = new Env(iniFilePath);
      expect(env, 'env').to.have.property('database');
      expect(env.database, 'env.database').to.have.property('main');
      expect(env.database, 'env.database').to.have.property('analytics');
      expect(env.database.main, 'env.database.main').to.have.property('host', 'localhost');
      expect(env.database.analytics, 'env.database.analytics').to.have.property('host', 'another');
    });

    it('should throw with a file that doesn\'t exist', () => {
      const unsafeContext = () => {
        const iniFilePath = path.join(__dirname, './do-no-exists.ini');
        const env = new Env(iniFilePath);
        return env;
      };
      expect(unsafeContext).to.throw;
    });
  });
});
