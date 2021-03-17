const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const artist_entity = require('../../entities/artist')
const artist_model = require('../../models/artist')

module.exports = (config) => {

    // To create an artist
    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let artist = new artist_entity.Artist(req.body.name);
        artist_model.InsertArtist(connection, artist);
    });

    // To get all artist
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);

        if(req.query.name != null ){
            // ex : "/artist?name=toto"
            let artists = artist_model.GetArtistByName(connection,req.query.name);
            artists.then(function(result){
                console.log(result);
            })
        }else{
            let artists = artist_model.GetAllArtists(connection)
            artists.then(function(result){
                console.log(result);
            })
        }

    });

    // Get artist identified by his id
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let artists = artist_model.GetArtistById(connection,req.params.id);
        artists.then(function(result){
            console.log(result);
        })
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("artist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });


    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_artist = new artist_entity.Artist(req.body.name);
        artist_model.UpdateArtist(connection, req.params.id, new_artist);
    });

    // Delete artist identified by id
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        artist_model.DeleteArtist(connection, req.params.id);
    });

    return router;
};