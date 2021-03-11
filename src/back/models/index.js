const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var configManager = require("./configManager.js")
var parserManager = require("./parserManager.js")
var dbManager = require("./dbManager.js")

const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = require("../api/routes/user_route.js");
const track = require('../entities/track.js');
const { Track } = require('../entities/track.js');
app.use('/api/v1', users());

// Load config
console.log("Load config ...");
var config = configManager.LoadConfig('../config.json')
console.log("Config loaded.");

// Arguments "Import section"
if (process.argv[2] == "import") {
    // Parse datasource
    console.log("Parse CSV file ...")
    var trackList = parserManager.ParseCSVToJson(config)
    trackList.shift()
    console.log("CSV parsed.")

    console.log("Element found " +trackList.length)

    

    // insert into db
    dbManager.OpenConnection(config)
    trackList.forEach(track => {
        console.log(track)
        dbManager.StoreTrackOnDB(config, track)
    });

    console.log("All import in DB finished")
}

const router = express.Router();

const user_route = require('../api/routes/user_route');
const track_route = require('../api/routes/track_route');
const artist_route = require('../api/routes/artist_route');
const playlist_route = require('../api/routes/playlist_route');

module.exports = () => {
    router.use('/user',user_route());
    router.use('/track',track_route());
    router.use('/artist',artist_route());
    router.use('/playlist',playlist_route());
    return router;
};


async function startServer() {
    const app = express();

    await require('../loaders')(app);

    app.listen(config.port_server, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }
        console.log(`
        ################################################
        🛡️  Server listening on port: ${config.port_server} 🛡️ 
        ################################################
      `);
    });
}

startServer();

console.log("end execution server")