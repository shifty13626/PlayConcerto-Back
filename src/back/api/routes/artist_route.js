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
        artist_model.InsertArtist(connection, artist).then((artist_created) => {
            if (artist_created['affectedRows'] !== 0) {
                res.status(200).send(`Artist ${artist.name} has been created.`);
            }
            else {
                res.status(400).send(`Artist ${artist} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    // To get all artist
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);

        if(req.query.name != null ){
            // ex : "/artist?name=toto"
            artist_model.GetArtistByName(connection,req.query.name).then( (artist) => {
                if(artist != null){
                    res.status(200).send(artist);
                }
                else {
                    res.status(400).send(`Can not get ${artist.name}.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            })
        }else{
            artist_model.GetAllArtists(connection).then( (artists) => {
                if(artists != null){
                    res.status(200).send(artists);
                }
                else {
                    res.status(400).send(`Can not get artists, there is none.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            })
        }
        connection.end();
    });

    // Get artist identified by his id
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        artist_model.GetArtistById(connection,req.params.id).then( (artist) => {
            if(artist != null){
                res.status(200).send(artist);
            }
            else {
                res.status(400).send(`Can not get ${artist.name}.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("artist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });


    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_artist = new artist_entity.Artist(req.body.name);
        artist_model.UpdateArtist(connection, req.params.id, new_artist);
        connection.end();
    });

    // Delete artist identified by id
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        artist_model.DeleteArtist(connection, req.params.id).then( (artist_deleted) => {
            if (artist_deleted['affectedRows'] !== 0) {
                res.status(200).send(`Artist ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`Artist ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    return router;
};
