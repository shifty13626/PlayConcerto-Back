// Function to insert an artist
function InsertArtist(nameArtist, connection)
{
    console.log("Artist to insert : " +nameArtist)
    //var id = CountArtist(connection);
    var query = "INSERT INTO artist (name) VALUE (\"" +nameArtist +"\");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

// Function to search an artist
function GetArtist(nameArtist, connection)
{
    var query = "SELECT * FROM artist WHERE name = \"" +nameArtist +"\";";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result[0].id_artist);
        });
    })
}

// Count nb artist
function CountArtist(connection)
{
    let query = "COUNT (*) FROM artist";

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            else return result;
        });
    });
}

// Function to insert a link between track and artist
function InsertLinkTrackArtist(idSong, idArtist, connection)
{
    var query = "INSERT INTO link_artist (id_track, id_artist) VALUES (" + idSong + "," + idArtist + ");"

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

module.exports = {
    //********************INSERT IN DATABASE********************
    InsertArtist : InsertArtist,

    //********************GET FROM DATABASE*********************
    GetArtist : GetArtist,

    //********************UPDATE IN DATABASE********************

    //********************DELETE FROM DATABASE******************

    //********************OTHER*********************************
    CountArtist : CountArtist,

    InsertLinkTrackArtist : InsertLinkTrackArtist
}