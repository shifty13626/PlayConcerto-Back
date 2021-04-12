module.exports = {
    //********************INSERT IN DATABASE*******************
    InsertPlaylist :  InsertPlaylist,

    //********************GET FROM DATABASE********************
    GetPlaylistById : GetPlaylistById,
    GetPlaylistByName : GetPlaylistByName,
    GetAllPlaylists : GetAllPlaylists,
    GetUserPlaylist : GetUserPlaylist,
    GetTrackPlaylist : GetTrackPlaylist,

    //********************UPDATE IN DATABASE*******************
    UpdatePlaylist : UpdatePlaylist,

    //********************DELETE IN DATABASE*******************
    DeletePlaylist : DeletePlaylist
}



//Function to insert playlist
function InsertPlaylist(connection, playlist)
{
   let query = "INSERT INTO playlist (name, id_genre) "
       + "values (\"" + playlist.name +"\"," +playlist.id_genre +");";

   connection.query(query, function (err, result, fields) {
       if (err) throw err;
   });
}

//Function to get playlist by id
function GetPlaylistById(connection, id)
{
    let query = "SELECT * FROM playlist WHERE playlist.id_playlist=" +id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

// function to get all track for a playlist identified by his name
function GetTrackPlaylist(connection, id_playlist)
{
    let query = "SELECT track.id_track, "
        + "track.title, "
        + "track.year, "
        + "track.duration, "
        + "track.add_date, "
        + "track.danceability, "
        + "track.energy, "
        + "track.instrumentalness, "
        + "track.liveness, "
        + "track.popularity, "
        + "artist.id_artist, "
        + "artist.name, "
        + "link_playlist.id_playlist "
        + "FROM track, artist, link_artist, link_playlist "
        + "WHERE track.id_track = link_artist.id_track "
        + "AND link_artist.id_artist = artist.id_artist "
        + "AND track.id_track = link_playlist.id_track "
        + "AND link_playlist.id_playlist = " +id_playlist
        + " ORDER BY track.id_track;";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}



//Function to get playlist by name
function GetPlaylistByName(connection, name)
{
    let query = "SELECT * FROM playlist WHERE playlist.name LIKE '" +name+"';";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get playlists
function GetAllPlaylists(connection)
{
    let query = "SELECT playlist.name, playlist.id_genre, link_user_playlist.id_user "
        + "FROM playlist, link_user_playlist "
        + "WHERE playlist.id_playlist = link_user_playlist.id_playlist "
        + "ORDER BY playlist.name;";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function GetUserPlaylist(connection, name, user)
{
    let query = "SELECT * FROM playlist, user WHERE user= "+user+" AND playlist.name LIKE" +name+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function UpdatePlaylist(connection, id, new_playlist)
{
    let query = "UPDATE playlist SET name='"+new_playlist.name+"', id_genre="+new_playlist.id_genre+" WHERE id_playlist="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function DeletePlaylist(connection, id)
{
    let query = "DELETE FROM playlist WHERE id_playlist="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

