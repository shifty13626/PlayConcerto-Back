var http = require('http');
var track = require("./entities/track.js")
const csv = require('csv-parser');
const fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080); var http = require('http');

// Read csv file
var trackList = []
var contents = fs.readFileSync('./dataset/spotify_tracks_copy.csv', 'utf8');
console.log(contents);

lines = contents.split('\n')

// create all track object
lines.forEach(element => {
  console.log(element + "\n")
  trackList.push(new track.Track(
    element.split(',')[1],
    element.split(',')[3],
    element.split(',')[12],
    element.split(',')[18],
  ))
});

// log all tracks created
// on console
console.log("list element")
trackList.forEach(element => {
  console.log(JSON.stringify(element))
});
// on json file
fs.writeFile('tracks.json', JSON.stringify(tracks, null, "\t"), 'utf8', function (err) {
  if (err) return console.log(err);
});

console.log("end execution")