module.exports = {
    //********************INSERT IN DATABASE********************
    InsertArtist : InsertArtist,

    //********************GET FROM DATABASE*********************
    GetAllArtists : GetAllArtists,
    GetArtistById : GetArtistById,
    GetArtistByName : GetArtistByName,

    //********************UPDATE IN DATABASE********************
    UpdateArtist : UpdateArtist,

    //********************DELETE FROM DATABASE******************
    DeleteArtist : DeleteArtist,

    //********************OTHER*********************************
    CountArtist : CountArtist,

    InsertLinkTrackArtist : InsertLinkTrackArtist
}

function InsertArtist(connection, artist)
{
    //console.log("Artist to insert : " +nameArtist)
    //var id = CountArtist(connection);
    var query = "INSERT INTO artist (name) " +
        "VALUE (\"" +artist.name +"\");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

function GetAllArtists(connection)
{
    let query = "SELECT * FROM artist;"
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function GetArtistById(connection, id)
{
    var query = "SELECT * FROM artist WHERE artist.id_artist =" +id+";";

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    })
}

function GetArtistByName(connection, name)
{
    let query = "SELECT * FROM artist WHERE artist.name LIKE '" +name+"';";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

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

function InsertLinkTrackArtist(connection, idSong, idArtist)
{
    var query = "INSERT INTO link_artist (id_track, id_artist) VALUES (" + idSong + "," + idArtist + ");"

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

function UpdateArtist(connection, id, new_artist)
{
    let query = "UPDATE artist SET name='"+new_artist.name+"' WHERE id_artist="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function DeleteArtist(connection, id)
{
    let query = "DELETE FROM artist WHERE id_artist="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

