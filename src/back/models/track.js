
module.exports = {
    //********************INSERT IN DATABASE********************
    InsertTrack : InsertTrack,

    //********************GET FROM DATABASE*********************
    GetTrack : GetTrack,

    GetTrackInsert : GetTrackInsert,

    GetTrackById : GetTrackById,
    GetIdTrack, GetIdTrack,

    GetTrackByName : GetTrackByName,

    GetAllTracks : GetAllTracks,

    GetTracksArtists : GetTracksArtists,
    LinkTrackArtist : LinkTrackArtist,

    //********************UPDATE IN DATABASE********************

    UpdateTrack : UpdateTrack,

    //********************DELETE FROM DATABASE******************

    DeleteTrack : DeleteTrack,

    //********************OTHER*********************************
    CountTrack : CountTrack
}

//Function to add a track on DB
function InsertTrack(connection, track)
{
    var query = "INSERT INTO track (title"
        + ", year"
        + ", duration"
        + ", add_date"
        + ", danceability"
        + ", energy"
        + ", instrumentalness"
        + ", liveness"
        + ", popularity)"
        + " values (\""
        + track.title +"\","
        + track.year +",\""
        + track.duration +"\""
        + ", NOW()"
        + "," +track.danceability
        +"," +track.energy
        +"," +track.instrumentalness
        +"," +track.liveness
        + "," +track.popularity +");";
    console.log("query : " +query);

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

// Function to search a track
function GetTrack(connection, track, size, index)
{
    console.log("track searched : " +track.name)

    var query = "SELECT * "
        + "FROM track, link_artist "
        + "WHERE track.name = \"" +track.name +"\" "
        + "AND track.id_track = link_artist.id_track "
        + "LIMIT " + (index * size) +" OFFSET " +size +";";

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
function GetTrackInsert(connection, track)
{
    let query = "SELECT * "
        + "FROM track "
        + "WHERE name = \"" +track.name +"\" "
        + "ORDER BY add_date DESC;"


    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_track);
        });
    })
}

// Function to get Id of a track
function GetIdTrack(connection, track)
{
    let query = "SELECT id_track "
    + "FROM track "
    + "WHERE title = \"" +track.title +"\" "
    + "AND duration = \"" +track.duration +"\" "
    + "AND danceability = \"" + track.danceability +"\" "
    + "ADN energy = \"" +track.energy +"\" "
    + "AND instrumentalness = \"" +track.instrumentalness +"\" "
    + "AND liveness = \"" +track.liveness +"\" "
    + "AND popularity = \"" +track.liveness +"\";"

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    })
}

// Count nb artist
function CountTrack(connection)
{
    let query = "COUNT (*) FROM track";

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            else return result;
        });
    });
}

//Function to get track by id
function GetTrackById(connection, id)
{
    let query = "SELECT * FROM track WHERE track.id_track=" +id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get track by name
function GetTrackByName(connection, name)
{
    let query = "SELECT * FROM track WHERE title LIKE \"%" +name +"%\";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}


//Function to get track by id
function GetAllTracks(connection)
{
    let query = "SELECT DISTINCT * "
        + "FROM track, artist, link_artist "
        + "WHERE track.id_track = link_artist.id_track "
        + "AND link_artist.id_artist = artist.id_artist "
        + "ORDER BY track.id_track;";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}


//Function to get artists of one track
function GetTracksArtists(connection, track_id)
{
    let query = "SELECT artist.name FROM link_artist, artist WHERE link_artist.id_track = " + track_id +
    " AND link_artist.id_artist = artist.id_artist;";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

// To link an artist to track
function LinkTrackArtist(connection, track_id, artist_id) {
    let query = "INSERT INTO link_artist (id_track, id_artist) "
    +"values (" +track_id +"," +artist_id +");";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}


//Function to get track by id
function UpdateTrack(connection, id, new_track)
{
    let query = "UPDATE track SET title=\'"+new_track.title+"\', year="+new_track.year+", " +
        "duration="+new_track.duration+" WHERE id_track="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function DeleteTrack(connection, id)
{
    let query_link_artist = "DELETE FROM link_artist WHERE id_track="+id+";";
    let query_link_playlist = "DELETE FROM link_playlist WHERE id_track="+id+";";
    connection.query(query_link_artist, function (err, result, fields) {
        if (err) throw err;
    });
    connection.query(query_link_playlist, function (err, result, fields) {
        if (err) throw err;
    });

    let query_track = "DELETE FROM track WHERE id_track="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query_track, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}
