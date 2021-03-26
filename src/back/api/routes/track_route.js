const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const track_entity = require('../../entities/track')
const track_model = require('../../models/track')

module.exports = (config) => {

    // To add a track
    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let track = new track_entity.Track(req.body.artist, req.body.danceability,
            req.body.duration, req.body.energy, req.body.instrumentalness,
            req.body.liveness, req.body.name, req.body.popularity, req.body.year);
        track_model.InsertTrack(connection, track).then((created) => {
            if (created['affectedRows'] !== 0) {
                res.status(200).send(`User ${track.title} has been created.`);
            }
            else {
                res.status(400).send(`User ${track} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
    });

    // To get all track
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.title != null ){
            // ex : "/track?name=toto"
            track_model.GetTrackByName(connection,req.query.title).then((result) => {
                if(result != null){
                    res.status(200).send(result);
                }
                else{
                    res.status(400).send(`Track ${req.query.title} not found in database.`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            })
        }else {
            track_model.GetAllTracks(connection).then((tracks) => {
                if(tracks != null){
                    res.status(200).send(tracks);
                }
                else{
                    res.status(400).send(`There is no tracks on database.`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            })
        }
    });

    // Get track by id
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.GetTrackById(connection,req.params.id).then((result) => {
            if (result != null){
                res.status(200).send(result);
            }
            else {
                res.status(400).send(`The song ${req.params.id} does not exist in the database.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
    });

    // To get a track identified by his id and artist id
    router.get('/:id/artist/:name', (req, res) => {
        console.log("track GET /:id/artist/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_track = new track_entity.Track(req.body.artist,req.body.danceability,req.body.duration,
            req.body.energy, req.body.instrumentalness, req.body.liveness,
            req.body.name, req.body.popularity, req.body.year)
        //new_track.sreq.body.name, req.body.year, req.body.duration);
        track_model.UpdateTrack(connection, req.params.id, new_track).then((result) => {
                if (result != null) {
                    res.status(200).send(`Track ${result} has been created.`);
                } else {
                    res.status(400).send(`Track has not been created, something is missing.`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            })
    });

    // To delete a track identified by id
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.DeleteTrack(connection, req.params.id).then( (deleted) => {
            if (deleted['affectedRows'] !== 0) {
                res.status(200).send(`Track ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`Track ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
    });

    return router;
};
