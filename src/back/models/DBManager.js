var mysql = require('mysql');

// to open connection to DB
function OpenConnection(config) {
    return mysql.createConnection({
        host: config.address,
        user: config.user,
        password: config.password,
        database: config.database_name
    });
}

// Function to add track on DB
function StoreTrackOnDB(config, Track)
{
    var connection = OpenConnection(config)
    var returnSearchArtist = GetArtist(Track.artist, connection)
    if(returnSearchArtist == "[]")
        InsertArtist(Track.artist, connection)
    
    console.log(returnSearchArtist)

    artist_id = ""
    InsertTrack(track, artist_id, connection)
}

// Function to search an artist
function GetArtist(nameArtist, connection)
{
    var query = "SELECT * FROM artist WHERE name = " +nameArtist +";";

    connection.connect(function(err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
          if (err) throw err;
          else return result;
        });  
    });
}

// Function to search an artist
function InsertArtist(nameArtist, connection)
{
    var id = CountArtist(connection);
    var query = "INSERT INTO artist VALUES (" + id +",'" +nameArtist +"');";
    
    connection.connect(function(err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
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
        con.query(query, function (err, result, fields) {
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
        con.query(query, function (err, result, fields) {
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
        con.query(query, function (err, result, fields) {
            if (err) throw err;
        });  
    });
}