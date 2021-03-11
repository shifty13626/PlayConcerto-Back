//Function to add a track on DB
function InsertTrack(track, connection)
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
function GetTrack(track, connection)
{
    console.log("track searched : " +track.name)

    var query = "SELECT * "
        + "FROM track, link_artist "
        + "WHERE track.name = \"" +track.name +"\" "
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
function GetTrackInsert(track, connection)
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

module.exports = {
    //********************INSERT IN DATABASE********************
    InsertTrack : InsertTrack,

    //********************GET FROM DATABASE*********************
    GetTrack : GetTrack,

    GetTrackInsert : GetTrackInsert,

    //********************UPDATE IN DATABASE********************

    //********************DELETE FROM DATABASE******************

    //********************OTHER*********************************
    CountTrack : CountTrack
}