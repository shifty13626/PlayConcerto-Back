var mysql = require('mysql');

module.exports = {
    // Function to add track on DB
    StoreTrackOnDB : function (config, track) {

        var connection = OpenConnection(config)
        if (connection != null) console.log("Connected to DB")
        else console.log("NOT connected to DB")

        var returnSearchArtist = GetArtist('MUSE', connection)        /track.artist
        console.log("Return request GetArtiste : " +returnSearchArtist)

        /*
        if(returnSearchArtist == "[]")
            InsertArtist(Track.artist, connection)
        
*/
        //artist_id = ""
        // InsertTrack(track, artist_id, connection)
    }
}


// to open connection to DB
function OpenConnection(config) {
    return mysql.createConnection({
        host: config.address,
        user: config.user,
        password: config.password,
        database: config.database_name
    });
}

// Function to search an artist
function GetArtist(nameArtist, connection)
{
    console.log("Artist searched : " +nameArtist)
    var query = "SELECT * FROM artist WHERE name = '" +nameArtist +"';";

    //connection.connect(function(err) {
    //    if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            console.log(result)
            console.log("field : " +fields[0].id_artist)
            console.log("result : " +result[0].id_artist)
            return result[0].id_artist;
        });  
    //});
    //connection.end();
}

// Function to search an artist
function InsertArtist(nameArtist, connection)
{
    var id = CountArtist(connection);
    var query = "INSERT INTO artist VALUES (" + id +",'" +nameArtist +"');";
    
    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
        });  
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
    var id = CountTrack(connection);
    var query = "INSERT INTO track (id_track, name, year, duration, artist_id)"
        +"VALUES (" + id +",'" +track.name +"'," +track.year +"," +track.duration +"," +artist_id +")";
    
    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
        });  
    });
}