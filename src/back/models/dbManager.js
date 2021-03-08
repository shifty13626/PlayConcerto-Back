var mysql = require('mysql');

module.exports = {
    // Function to add track on DB
    StoreTrackOnDB : async function (config, track) {
        console.log("Start import in DB ...")
        var connection = OpenConnection(config)
        if (connection != null) console.log("Connected to DB")
        else console.log("NOT connected to DB")

        try {
            // check artiste already exist
            const idArtist = await GetArtist('Toto', connection);
            console.log("Return request GetArtiste (Toto): " +idArtist);
    
            // if artist doesn't exist
            if (idArtist === null)
            {
                console.log("Artiste, doesn't exist ... creation ...")
                InsertArtist(track.artist, connection)
                console.log("Artiste created.")
            }

        } catch (error) {
            console.log(error)
        }
       

        /* 
        if(returnSearchArtist == "[]")
            InsertArtist(Track.artist, connection)
        
        InsertTrack(track, artist_id, connection)
        */
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

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_artist);
        });

    })
}


/*
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result.length === 0){
            console.log("no result")
            return null;
        }
        else {
            console.log(result[0]);
            console.log(result[0].id_artist)
            console.log(result[0].name)
            return result[0].id_artist;
        }
    });
    */


// Function to search an artist
function InsertArtist(nameArtist, connection)
{
   //var id = CountArtist(connection);
    var query = "INSERT INTO artist VALUES ('" +nameArtist +"');";
    
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