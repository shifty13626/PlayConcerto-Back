var track = require("../entities/track.js")
var genre = require("../entities/genre.js")
const fs = require('fs');

module.exports = {
  ParseCSVTrackToJson : function (config) {
    return ParseCSVTrack(config)
  },
  ParseCSVGenreToJson : function (config) {
    return ParseCSVGenre(config)
  }
}

function ParseCSVTrack (config) {
  // Read csv file
  var trackList = []
  var contents = fs.readFileSync(config.pathCSVTrackToRead, 'utf8');

  lines = contents.split('\n')
      

      // create all track object
      .forEach(element => {
        var artists = element.split(';')[1].substring(2, (element.split(';')[1].length-2))
            .split(",")

        for (index = 0; index < artists.length; ++index) {
          artists[index] = artists[index].replace("'", "");
          artists[index] = artists[index].replace("'", "");
          //artists[index] = artists[index].replaceAll(" ", "");
          artists[index] = artists[index].replace("\"", "");
          artists[index] = artists[index].replace("\"", "");
        }

        let name = element.split(';')[12]
        name = name.replace("\"", "")
        name = name.replace("\"", "")

        trackList.push(new track.Track(
            //element.split(',')[1].substring(2, (element.split(',')[1].length-2)),   // artist
            artists,
            element.split(';')[2],    // danceability
            element.split(';')[3],    // duration
            element.split(';')[4],    // energy
            element.split(';')[7],    // instrumentalness
            element.split(';')[9],    // liveness
            name,                              // name
            element.split(';')[13],   // popularity
            element.split(';')[18],   // year
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

function ParseCSVGenre(config) {
  var contents = fs.readFileSync(config.pathCSVGenreToRead, 'utf8');

  var genreList = []
  lines = contents.split('\n')

      // create all track object
      .forEach(element => {
        genreList.push(new genre.Genre(element.split(",")[1]))
      })

  // on json file
  fs.writeFile(config.pathJsonGenre, JSON.stringify(genreList, null, "\t"), 'utf8', function (err) {
    if (err) return console.log(err);
  });

  return genreList
}