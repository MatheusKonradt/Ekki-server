const path = require('path');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Koa = require('koa');
const App = require('./classes/App');
const Env = require('./classes/Env');
const AuthClaim = require('./classes/AuthClaim');
const router = require('./routes/router');
const responseMiddleware = require('./routes/middlewares/response');
const env = require('./env');

const koa = new Koa();
const app = new App();
app.initializeEnvVars(env.ini_file);
AuthClaim.loadCertFiles(env.jwt, env.jwt_pub);

async function waitForAppReadyState(ctx, next) {
  await app.waitForReadyState();
  await next();
}

koa.use(cors());
koa.use(bodyParser());
koa.use(waitForAppReadyState);
koa.use(responseMiddleware(app));
koa.use(router(app));

const baseConfigFile = path.join(__dirname, 'config.ini');
const baseConfig = new Env(baseConfigFile);

const server = koa.listen(baseConfig.http.port, async () => {
  const addr = server.address();
  console.log('listening on', addr);
  await app.waitForReadyState();
});

module.exports = server;
