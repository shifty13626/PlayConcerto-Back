const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const track_entity = require('../../entities/track')
const track_model = require('../../models/track')

module.exports = (config) => {

    // To add a track
    /**
     * @openapi
     * /api/tracks:
     *   post:
     *     description: Welcome to swagger-jsdoc!
     *     tags:
     *       - Track
     *     responses:
     *       200:
     *         description: Returns a mysterious string.
     */
    router.post('/', async (req, res) => {
        console.log("request add track...");
        let connection = dbManager.OpenConnection(config);
        console.log("title : " +req.body.title)

        let track = req.body;
        console.log("track : " +JSON.stringify(track));
        const created = await track_model.InsertTrack(connection, track);
        console.log(created)
        if (created.affectedRows !== 0) {
            console.log("created.insertId : " +created.insertId);
            console.log(track);
            console.log("list id artist : " +track.list_artist_id);
            for (const id_artist of track.list_artist_id) {
                console.log("id artist ! " + id_artist);
                await track_model.LinkTrackArtist(connection, created.insertId, id_artist)
            }
            res.status(200).send(`Track ${track.title}, ${created.insertId} has been created.`);
        }
        else {
            res.status(400).send(`Track ${track} cannot be created. Pseudo is mandatory.`);
        }
        connection.end();
    });

    // To get all track
    router.get('/', async (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.title != null ){
            console.log("Get track by name : " +req.query.title)
            // ex : "/track?title=toto"
            track_model.GetTrackByName(connection,req.query.title).then((track) => {
                if(track != null){
                    res.status(200).send(track[0]);
                }
                else{
                    res.status(400).send(`Track ${req.query.title} not found in database.`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            })
        }else {
            console.log("Get all track")
            const tracks = await track_model.GetAllTracks(connection);
            if(tracks != null) {
                let previous_title = undefined;
                let occurrences = 0;
                for (const [index, actual_track] of tracks.entries()){

                    if (previous_title === actual_track.title){
                        occurrences += 1;
                        tracks[index - occurrences].name +=  ", " + actual_track.name;
                        delete tracks[index];
                    }
                    else {
                        previous_title = actual_track.title;
                        occurrences = 0;
                    }
                }
                // remove null objects that where occurrences with other artists.
                const filtered_tracks = tracks.filter( (el) => {
                    return el != null;
                });

                for (const track of filtered_tracks) {
                    track.list_playlist_id = await track_model.GetIdPlaylistTrack(connection, track.id_track)
                }

                res.status(200).send(filtered_tracks);
            }
            else{
                res.status(400).send(`There is no tracks on database.`);
            }
        }
        connection.end();
    });

    // To link track to a playlist
    router.post('/linkPlaylist', async (req, res) => {
        console.log("request link track to playlist ...");
        let connection = dbManager.OpenConnection(config);

        let link = req.body;
        const created = await track_model.LinkTrackPlaylist(connection, link.id_track, link.id_playlist);
        console.log(created)
        if (created.affectedRows !== 0) {
            res.status(200).send({success : true});
        }
        else {
            res.status(400).send(`Track ${link.id_track} cannot be linked.`);
        }
        connection.end();
    });

    // To unlink track to a playlist
    router.post('/unlinkPlaylist', async (req, res) => {
        console.log("request link track to playlist ...");
        let connection = dbManager.OpenConnection(config);

        let link = req.body;
        const created = await track_model.UnlinkTrackPlaylist(connection, link.id_track, link.id_playlist);
        console.log(created)
        if (created.affectedRows !== 0) {
            res.status(200).send({success : true});
        }
        else {
            res.status(400).send(`Track ${link.id_track} cannot be unlinked.`);
        }
        connection.end();
    });


    // Get track by id
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.GetTrackById(connection,req.params.id).then((track) => {
            if (track != null){
                res.status(200).send(track[0]);
            }
            else {
                res.status(400).send(`The song ${req.params.id} does not exist in the database.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    // To get a track identified by his id and artist id
    router.get('/:id/artists', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.GetTracksArtists(connection, req.params.id).then( (artists) => {
            console.log(artists);
            if (artists != null){
                res.status(200).send(artists);
            }
            else {
                res.status(400).send(`The song ${req.params.id} does not have artists.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_track = new track_entity.Track(req.body.artist,req.body.danceability,req.body.duration,
            req.body.energy, req.body.instrumentalness, req.body.liveness,
            req.body.name, req.body.popularity, req.body.year)
        //new_track.req.body.name, req.body.year, req.body.duration);
        track_model.UpdateTrack(connection, req.params.id, new_track).then((result) => {
            if (result != null) {
                res.status(200).send(`Track ${result} has been created.`);
            } else {
                res.status(400).send(`Track has not been created, something is missing.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    // To delete a track identified by id
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        track_model.DeleteTrack(connection, req.params.id).then( (deleted_track) => {
            if (deleted_track['affectedRows'] !== 0) {
                res.status(200).send(`Track ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`Track ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    return router;
};
