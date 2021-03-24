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
        track_model.InsertTrack(connection, track);
        console.log("track POST /");
    });

    // To get all track
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.name != null ){
            // ex : "/track?name=toto"
            let tracks = track_model.GetTrackByName(connection,req.query.name);
            tracks.then(function(result){
                console.log(result);
            })
        }else {
            track_model.GetAllTracks(connection).then((tracks) => {
                res.status(200).send(tracks)
            })
            console.log("track GET /");
        }
    });

    // Get track by id
    router.get('/:id', (req, res) => {
        console.log("track GET /:id => id = "+req.params.id);
        let connection = dbManager.OpenConnection(config);
        let tracks = track_model.GetTrackById(connection,req.params.id);
        tracks.then(function(result){
            console.log(result);
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
        track_model.UpdateTrack(connection, req.params.id, new_track);
        console.log("track PUT /:id => id = "+req.params.id);
    });

    // To delete a track identified by id
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.DeleteTrack(connection, req.params.id);
        console.log("track DELETE /:id => id = "+req.params.id);
    });

    return router;
};
