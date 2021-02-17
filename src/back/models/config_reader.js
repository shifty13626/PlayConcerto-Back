const config = require('../../entities/config');
const fs = require('fs');

const json_file = fs.readFileSync('../config.json', 'utf8');

config.Config = JSON.parse(json_file);
console.log(config.Config)