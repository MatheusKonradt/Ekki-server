const AuthClaim = require('../classes/AuthClaim');
const App = require('../classes/App');
const env = require('../env');

exports.createTestApp = async () => {
  const app = new App();
  app.initializeEnvVars(env.ini_file);
  AuthClaim.loadCertFiles(env.jwt, env.jwt_pub);
  await app.waitForReadyState();
  return app;
};
