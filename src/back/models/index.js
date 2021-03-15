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
    importTrackDB();
    importGenreDB();
}

// Arguments "Purge section"
if (process.argv[2] == "purge") {
    dbManager.OpenConnection(config)
    dbManager.PurgeAllTableDB()
}


// Arguments "Import section"
if (process.argv[2] == "listen" || process.argv[3] == "listen") {
    const router = express.Router();

    const user_route = require('../api/routes/user_route');
    const track_route = require('../api/routes/track_route');
    const artist_route = require('../api/routes/artist_route');
    const playlist_route = require('../api/routes/playlist_route');

    module.exports = () => {
        router.use('/user', user_route());
        router.use('/track', track_route());
        router.use('/artist', artist_route());
        router.use('/playlist', playlist_route());
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
}

async function importTrackDB () {
    // Parse datasource
    console.log("Parse CSV file track ...")
    let trackList = parserManager.ParseCSVTrackToJson(config)
    trackList.shift()
    console.log("CSV track parsed.")
    console.log(trackList)

    console.log("Element found before splice" +trackList.length)

    // keep track after 2015
    for(let song of trackList) {
          if(song.year < 2015) {
              var index = trackList.indexOf(song)
              trackList.splice(index, 1)
          }
    }
    console.log("Element found after splice" +trackList.length)

    // insert into db
    dbManager.OpenConnection(config)
    for(let song of trackList) {
        await dbManager.StoreTrackOnDB(config, song)
    }


    console.log("All import track in DB finished")
}

async function importGenreDB() {
    // Parse datasource
    console.log("Parse CSV file genre ...")
    let genreList = parserManager.ParseCSVGenreToJson(config)
    //genreList.shift()
    console.log("CSV genre parsed.")
    console.log(genreList)

    dbManager.OpenConnection(config)
    for(let genre of genreList) {
        await dbManager.StoreGenreOnDB(config, genre)
    }
    console.log("All import genre in DB finished")
}

console.log("end execution server")