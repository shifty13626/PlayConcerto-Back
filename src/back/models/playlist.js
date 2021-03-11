module.exports = {
    //********************INSERT IN DATABASE********************
    InsertPlaylist : function InsertPlaylist(connection, playlist){
        InsertPlaylist(connection, playlist)
    },

    //********************GET FROM DATABASE********************
    GetPlaylists : function GetPlaylists(connection){
        GetPlaylists(connection)
    },

    GetPlaylistById : function GetPlaylistById(connection, id){
        GetPlaylistById(connection, id)
    },

    GetPlaylistByName : function GetPlaylistByName(connection, name){
        GetPlaylistByName(connection, name)
    },

    GetUserPlaylist : function GetUserPlaylist(connection, name, user){
        GetUserPlaylist(connection, name, user)
    },

    //********************UPDATE IN DATABASE********************
    UpdatePlaylist : function UpdatePlaylist(connection, id, playlist){
        UpdatePlaylist(connection, id, playlist)
    },

    //********************DELETE IN DATABASE********************
    DeletePlaylist : function DeletePlaylist(connection, id){
        DeletePlaylist(connection, id)
    }

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
    let query = "SELECT * FROM playlist WHERE playlist.id=" +id+");";
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
    let query = "SELECT * FROM playlist WHERE playlist.name LIKE" +name+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get playlists
function GetPlaylists(connection)
{
    let query = "SELECT * FROM playlist"
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
    let query = "UPDATE playlist SET name="+new_playlist.name+", id_genre="+new_playlist.id_genre+" WHERE id= "+id+");";
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
    let query = "DELETE FROM playlist WHERE id="+id+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}