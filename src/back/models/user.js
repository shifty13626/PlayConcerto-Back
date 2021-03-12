//Function to insert user
function InsertUser(user, connection)
{
    let query = "INSERT INTO user (name, year, duration, User_id) "
        + "values (\"" + user.name +"\"," +user.year +"," +track.duration +"," +User_id +");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

function CountUser(connection)
{
    let query = "COUNT (*) FROM user";

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            else return result;
        });
    });
}

//Function to get user by id
function GetUserById(connection, id)
{
    let query = "SELECT * FROM user WHERE id_user=" +id+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get user by pseudo
function GetUserByPseudo(connection, pseudo)
{
    let query = "SELECT * FROM user WHERE pseudo=" +pseudo+";";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get user by pseudo
function GetAllUsers(connection)
{
    let query = "SELECT * FROM user;";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function UpdateUser(connection, id, new_user)
{
    let query;
    if (new_user.firstname !== undefined && new_user.lastname !== undefined) {
        query = "UPDATE user SET pseudo=\""+new_user.pseudo+"\", firstname=\""+new_user.firstname+"\", lastname=\""+new_user.lastname+"\" WHERE id_user="+id+";";
    }
    else{
        query = "UPDATE user SET pseudo=\""+new_user.pseudo+"\" WHERE id_user="+id+";";
    }
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}


function DeleteUser(connection, id)
{
    let query_link_user_playlist = "DELETE FROM link_user_playlist WHERE id_user="+id+";";
    connection.query(query_link_user_playlist, function (err, result, fields) {
        if (err) throw err;
    });
    let query_track = "DELETE FROM user WHERE id_user="+id+";";
    return new Promise((resolve, reject) => {
        connection.query(query_track, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

function InsertLinkUserPlaylist(connection, idUser, idPlaylist)
{
    let query = "INSERT INTO link_user_playlist (id_user, id_playlist) VALUES (" + idUser + "," + idPlaylist + ");"

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

module.exports = {
    //********************INSERT IN DATABASE********************
    InsertUser : InsertUser,
    //********************GET FROM DATABASE*********************
    GetAllUsers : GetAllUsers,
    GetUserById : GetUserById,
    GetUserByPseudo : GetUserByPseudo,

    //********************UPDATE IN DATABASE********************
    UpdateUser : UpdateUser,

    //********************DELETE FROM DATABASE******************
    DeleteUser : DeleteUser,

    //********************OTHER*********************************
    CountUser : CountUser,

    InsertLinkUserPlaylist : InsertLinkUserPlaylist
}