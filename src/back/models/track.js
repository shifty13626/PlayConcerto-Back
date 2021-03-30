
module.exports = {
    //********************INSERT IN DATABASE********************
    InsertTrack : InsertTrack,

    //********************GET FROM DATABASE*********************
    GetTrack : GetTrack,

    GetTrackInsert : GetTrackInsert,

    GetTrackById : GetTrackById,

    GetTrackByName : GetTrackByName,

    GetAllTracks : GetAllTracks,

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
    let d = new Date();
    let date = d.getFullYear() +"/" +d.getMonth() +"/" +d.getDay()
        +"_" +d.getHours() +":" +d.getMinutes() +":" +d.getSeconds()
    var query = "INSERT INTO track (name, year, duration, add_date) "
        + "values (\"" + track.name +"\"," +track.year +"," +track.duration +", NOW());";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
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
    let query = "SELECT * FROM track;";
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
