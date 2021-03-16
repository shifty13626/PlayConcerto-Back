const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let configManager = require("./configManager.js")
let parserManager = require("./parserManager.js")
let dbManager = require("./dbManager.js")

const app = express();

app.use(cors());
app.use(bodyParser.json());

const track = require('../entities/track.js');
const { Track } = require('../entities/track.js');

// Load config
console.log("Load config ...");
let config = configManager.LoadConfig('../config.json')
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

    async function startServer() {
        const app = express();

        await require('../loaders')(app, config);

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
              let index = trackList.indexOf(song)
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