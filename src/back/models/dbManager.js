var mysql = require('mysql');

var connection;

module.exports = {
    // to open connection to DB
    OpenConnection : function OpenConnection(config) {
        connection = mysql.createConnection({
            host: config.address,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database_name
        });
        if (connection != null) console.log("Connected to DB")
        else console.log("NOT connected to DB")
    },

    // Function to add track on DB
    StoreTrackOnDB : async function (config, track) {
        console.log("Start import in DB ...")

        try {
            var listIdArtist = [];

            // for each artist
            track.artist.forEach(async function(artist) {

                // check artist already exist
                var tempId = await GetArtist(artist, connection);

                // if artist not exist
                if (tempId === null) {
                    console.log("Artiste, doesn't exist ... creation ...")
                    InsertArtist(track.artist, connection)
                    console.log("Artiste created.")
                }

                listIdArtist.push(await GetArtist(track.artist, connection));
            });

            // check song already exist
            var idSong = await GetTrack(track, connection);

            // If song don't exist, create it
            if(idSong === null)
            {
                console.log("Track, doesn't exist ... creation ...")
                InsertTrack(track, idArtist, connection)
                console.log("Track created.")
                idSong = await GetTrack(track, connection);
            }
            else console.log("Song already exist, not imported");

            console.log()

        } catch (error) {
            console.log(error)
        }
       
        // add link track / artist
        InsertLinkTrackArtist(idSong, idArtist, connection)
    }
}




// Function to search an artist
function GetArtist(nameArtist, connection)
{
    console.log("Artist searched : " +nameArtist)
    var query = "SELECT * FROM artist WHERE name = \"" +nameArtist +"\";";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_artist);
        });
    })
}

// Function to search an artist
function GetTrack(track, connection)
{
    console.log("track searched : " +track.name)
    var query = "SELECT * "
    + "FROM track, artist "
    + " WHERE track.name = \"" + track.name +"\" "
    + " AND track.artist_id = artist.id_artist "
    + "AND artist.name = \"" + track.artist +"\";"

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_track);
        });
    })
}



// Function to insert an artist
function InsertArtist(nameArtist, connection)
{
   //var id = CountArtist(connection);
    var query = "INSERT INTO artist (name) VALUE (\"" +nameArtist +"\");";
    
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });  
}


// Function to insert a link between track and artist
function InsertLinkTrackArtist(idSong, idArtist, connection)
{
    //var id = CountArtist(connection);
    var query = "INSERT INTO link_artist (id_track, id_artist) VALUES (" +idSong +"," +idArtist +");"

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

// Count nb artist
function CountArtist(connection)
{
    var query = "COUNT (*) FROM artist";

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
          if (err) throw err;
          else return result;
        });
    });  
}

// Count nb artist
function CountTrack(connection)
{
    var query = "COUNT (*) FROM track";

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
          if (err) throw err;
          else return result;
        });
    });  
}

//Function to add a track on DB
function InsertTrack(track, artist_id, connection)
{
    var query = "INSERT INTO track (name, year, duration, artist_id) "
    + "values (\"" + track.name +"\"," +track.year +"," +track.duration +"," +artist_id +");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });  
}