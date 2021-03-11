module.exports = {
    //********************INSERT IN DATABASE********************
    InsertGenre : function InsertGenre(connection, genre){
        InsertGenre(connection, genre)
    },

    //********************GET FROM DATABASE********************
    GetGenreById : function GetGenreById(connection, id) {
        GetGenreById(connection, id)
    },

    GetGenreByName : function GetGenreByName(connection, name) {
        GetGenreByName(connection, name)
    },

    GetAllGenres : function GetAllGenres(connection) {
        GetAllGenres(connection)
    },

    //********************UPDATE IN DATABASE********************
    UpdateGenre : function UpdateGenre(connection, id, genre) {
        UpdateGenre(connection, id, genre)
    },

    //********************DELETE FROM DATABASE********************
    DeleteGenre : function DeleteGenre(connection, id) {
        DeleteGenre(connection, id)
    }
}

//Function to insert genre
function InsertGenre(connection, genre)
{
    let query = "INSERT INTO genre (name) "
        + "values (\"" + genre.name +");";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
    });
}

//Function to get playlist by id
function GetGenreById(connection, id)
{
    let query = "SELECT * FROM genre WHERE genre.id_genre=" +id+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get genre by name
function GetGenreByName(connection, name)
{
    let query = "SELECT * FROM genre WHERE genre.name=" +name+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Function to get all genres
function GetAllGenres(connection)
{
    let query = "SELECT * FROM genre;"
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Update a genre by id
function UpdateGenre(connection, id, new_genre)
{
    let query = "UPDATE genre SET name="+new_genre.name+" WHERE id_genre= "+id+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

//Delete genre by id
function DeleteGenre(connection, id)
{
    let query = "DELETE FROM genre WHERE id_genre="+id+");";
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0) resolve(null);
            else resolve(result);
        });
    });
}

