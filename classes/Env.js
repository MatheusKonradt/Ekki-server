const fs = require('fs');
const iniParser = require('ini');

class Env {
  constructor(iniFilePath) {
    const iniFile = fs.readFileSync(iniFilePath, 'utf-8');
    const ini = iniParser.parse(iniFile);
    Object.assign(this, ini);
  }
}

module.exports = Env;
