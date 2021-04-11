const dbManager = require('../../models/dbManager');
const genre_model = require('../../models/genre');
const express = require("express");
const router = express.Router();
const genre_entity = require('../../entities/genre');

module.exports = (config) => {
    // To get all genre
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);

        genre_model.GetAllGenres(connection).then(genres => {
            if(genres != null){
                res.status(200).send(genres);
            }
            else {
                res.status(400).send(`Can not get genres, there is none.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
    });

    // To create a genre
    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let genre = new genre_entity.Genre(req.body.name);
        genre_model.InsertGenre(connection, genre).then((genre_created) => {
            if (genre_created['affectedRows'] !== 0) {
                res.status(200).send(`Genre ${genre.name} has been created.`);
            }
            else {
                res.status(400).send(`Genre ${genre} cannot be created.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    return router;
}