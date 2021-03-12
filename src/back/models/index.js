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
    importDataDB();
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

async function importDataDB () {
    // Parse datasource
    console.log("Parse CSV file ...")
    let trackList = parserManager.ParseCSVToJson(config)
    trackList.shift()
    console.log("CSV parsed.")
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
    // for (let i = 0; i < track.artist.length; i++) {
    //trackList.forEach(async function(song) {
    for(let song of trackList) {
        await dbManager.StoreTrackOnDB(config, song)
    }


    console.log("All import in DB finished")
}

console.log("end execution server")