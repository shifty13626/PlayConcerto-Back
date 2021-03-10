const config = require('../entities/config');
const fs = require('fs');

module.exports = {
    LoadConfig : function (url) {
        const json_file = fs.readFileSync(url, 'utf8');

        config.Config = JSON.parse(json_file);
        console.log("Config loaded :")
        console.log(config.Config)
        return config.Config
    }
}

