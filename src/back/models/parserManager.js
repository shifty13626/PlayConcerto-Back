var http = require('http');
var track = require("../entities/track.js")
var config = require("./configManager.js")
const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
  ParseCSVToJson : function (config) {
    // Read csv file
    var trackList = []
    var contents = fs.readFileSync(config.pathCSVToRead, 'utf8');
    console.log(contents);

    lines = contents.split('\n')

    // create all track object
    .forEach(element => {
      var artists = element.split(',')[1].substring(2, (element.split(',')[1].length-2))
          .split(",")

      trackList.push(new track.Track(
        //element.split(',')[1].substring(2, (element.split(',')[1].length-2)),   // artist
        artists,
        element.split(',')[2],    // danceability
        element.split(',')[3],    // duration
        element.split(',')[4],    // energy
        element.split(',')[7],    // instrumentalness
        element.split(',')[9],    // liveness
        element.split(',')[12],   // name
        element.split(',')[13],   // popularity
        element.split(',')[18],   // year
      ))
    });

    // log all tracks created
    // on console
    console.log("Track found on CSV : " +(trackList.length - 1))

    // on json file
    fs.writeFile(config.pathJsonTracks, JSON.stringify(trackList, null, "\t"), 'utf8', function (err) {
      if (err) return console.log(err);
    });

    console.log("end parsing, json file ready.")
    return trackList;
  }
}

