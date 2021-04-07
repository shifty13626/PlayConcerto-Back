let mysql = require('mysql');

let connection;

module.exports = {
    // to open connection to DB
    OpenConnection : OpenConnectionDB,
    // Function to add track on DB
    StoreTrackOnDB : async function (config, track) {
        importTrackDB(config, track)
    },
    // Function to add a genre on DB
    StoreGenreOnDB : async function (config, genre) {
        importGenreDB(config, genre)
    },
    // Purge database
    PurgeAllTableDB : async function () {
        purgeDB()
    }
}

function OpenConnectionDB(config) {
    connection = mysql.createConnection({
        host: config.address,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database_name
    });
    if (connection != null) console.log("Connected to DB")
    else console.log("NOT connected to DB")
    return connection
}

async function importTrackDB(config, track) {
    console.log("Start import in DB, track : " +track.name +"'")
    console.log("Track before import procedure")
    console.log(track)

        try {
            // for each artist
            for (let i = 0; i < track.artist.length; i++) {
                // check artist already exist
                var tempId = await GetArtist(track.artist[i], connection);

                // if artist not exist
                if (tempId === null) {
                    console.log("Artist '" +track.artist[i] +"', doesn't exist ... creation ...")
                    await InsertArtist(track.artist[i], connection)
                    console.log("Artist '" +track.artist[i] +"' created.")
                }

                track.list_artist_id.push(await GetArtist(track.artist[i], connection));
            };


            // check song already exist
            track.id = await GetTrackInsert(track, connection);

            // If song don't exist, create it
            if(track.id === null)
            {
                console.log("Track '" +track.name +"', doesn't exist ... creation ...")
                InsertTrack(track, connection)
                console.log("Track '" +track.name +"' created.")
                track.id = await GetTrackInsert(track, connection);
            }
            else console.log("Track '" +track.name +"' already exist, not imported");

            // add link track / artist
            for (let i = 0; i < track.list_artist_id.length; i++) {
                InsertLinkTrackArtist(track.id, track.list_artist_id[i], connection)
                console.log("Track linked")
            }
            console.log("Track after import procedure")
            console.log(track)

        console.log()

    } catch (error) {
        console.log(error)
    }
}

// Function to search an artist
function GetArtist(nameArtist, connection) {
    var query = "SELECT * FROM artist WHERE name = \"" +nameArtist +"\";";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_artist);
        });
    })
}

// Function to search a track
function GetTrack(track, connection) {
    console.log("track searched : " +track.name)

    var query = "SELECT * "
        + "FROM track, link_artist "
        + "WHERE track.title = \"" +track.name +"\" "
        + "AND track.id_track = link_artist.id_track ";

    track.list_artist_id.forEach(function(idArtist) {
        query += "AND link_artist.id_artist = " +idArtist;
    })

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_track);
        });
    })
}

// Function to search a track during insertion on DB
function GetTrackInsert(track, connection) {
    let query = "SELECT * "
        + "FROM track "
        + "WHERE title = \"" +track.name +"\" "
        + "ORDER BY add_date DESC;"


    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_track);
        });
    })
}

// Function to insert an artist
function InsertArtist(nameArtist, connection) {
    console.log("Artist to insert : " +nameArtist)
   //var id = CountArtist(connection);
    var query = "INSERT INTO artist (name) VALUE (\"" +nameArtist +"\");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

// Function to insert a link between track and artist
function InsertLinkTrackArtist(idSong, idArtist, connection) {
    var query = "INSERT INTO link_artist (id_track, id_artist) VALUES (" +idSong +"," +idArtist +");"

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

// Count nb artist
function CountArtist(connection) {
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
function CountTrack(connection) {
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
function InsertTrack(track, connection) {
    var query = "INSERT INTO track (title"
        + ", year"
        + ", duration"
        + ", add_date"
        + ", danceability"
        + ", energy"
        + ", instrumentalness"
        + ", liveness"
        + ", popularity)"
        + "values (\""
        + track.name +"\","
        + track.year +",\""
        + track.duration +"\""
        + ", NOW()"
        + "," +track.danceability
        +"," +track.energy
        +"," +track.instrumentalness
        +"," +track.liveness
        + "," +track.popularity +");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}



// Function to add a genre on DB
async function importGenreDB(config, genre) {
    // search if genre already exist
    let idGenre = getGenre(connection, genre.name)

    if (idGenre == null) {
        InsertGenre(connection, genre.name)
    }
}

// Function to search an artist
function getGenre(connection, nameGenre) {
    var query = "SELECT * FROM genre WHERE name = \"" +nameGenre +"\";";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_genre);
        });
    })
}

// To insert a new genre on DB
function InsertGenre(connection, nameGenre) {
    var query = "INSERT INTO genre (name) "
        + "value (\"" + nameGenre +"\");,";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

// To delete all date in DB
function purgeDB() {
    // DELETE link playlist
    let query = "DELETE FROM link_playlist";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE link user/playlist
    query = "DELETE FROM link_user_playlist";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE link artist / track
    query = "DELETE FROM link_artist";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE playlist
    query = "DELETE FROM playlist;";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE genre
    query = "DELETE FROM genre";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE track
    query = "DELETE FROM track";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });

    // DELETE artist
    query = "DELETE FROM artist";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });



    // DELETE user
    query = "DELETE FROM user";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}
