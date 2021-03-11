//Function to insert user
function InsertUser(user, connection)
{
    let query = "INSERT INTO user (name, year, duration, artist_id) "
        + "values (\"" + user.name +"\"," +user.year +"," +track.duration +"," +artist_id +");";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

module.exports = {
    //********************INSERT IN DATABASE********************
    InsertUser : InsertUser,

    //********************GET FROM DATABASE*********************

    //********************UPDATE IN DATABASE********************

    //********************DELETE FROM DATABASE******************

    //********************OTHER*********************************
}