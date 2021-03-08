const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var configManager = require("./configManager.js")
var parserManager = require("./parserManager.js")
var dbManager = require("./dbManager.js")

const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = require("../api/routes/user.js");
const track = require('../entities/track.js');
const { Track } = require('../entities/track.js');
app.use('/api/v1', users());

// Load config
console.log("Load config ...");
var config = configManager.LoadConfig('../config.json')
console.log("Config loaded.");

// Arguments
if (process.argv[2] == "import") {
    // Parse datasource
    console.log("Parse CSV file ...")
    var trackList = parserManager.ParseCSVToJson(config)
    trackList.shift()
    console.log("CSV parsed.")

    var song = new Track(
        "Toto",
        "10",
        "4.30",
        "70",
        "0",
        "100",
        "Africa",
        "100",
        "1975"
    )
    //.Add(song)

    dbManager.StoreTrackOnDB(config, song)
    /*
    // Add track to DB
    trackList.forEach(track => {
        dbManager.StoreTrackOnDB(config, track)
    });
    */
}

console.log("end execution")