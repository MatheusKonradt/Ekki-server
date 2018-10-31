const path = require('path');

const env = {
  production: {
    ini_file: '/run/secrets/env_ini',
    jwt_pub: '/run/secrets/jwt_cert_pub',
    jwt: '/run/secrets/jwt_cert',
  },
  stage: {
    ini_file: '/run/secrets/env_ini',
    jwt_pub: '/run/secrets/jwt_cert_pub',
    jwt: '/run/secrets/jwt_cert',
  },
  development: {
    ini_file: path.join(process.cwd(), 'secrets/dev.ini'),
    jwt_pub: path.join(process.cwd(), 'secrets/jwtRS256.pub.rsa'),
    jwt: path.join(process.cwd(), 'secrets/jwtRS256.rsa'),
  },
  test: {
    ini_file: path.join(process.cwd(), 'secrets/test.ini'),
    jwt_pub: path.join(process.cwd(), 'secrets/jwtRS256.pub.rsa'),
    jwt: path.join(process.cwd(), 'secrets/jwtRS256.rsa'),
  },
};

module.exports = env[process.env.NODE_ENV || 'development'];
