const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const track_entity = require('../../entities/track')
const track_model = require('../../models/track')

module.exports = (config) => {

    /**
     * @swagger
     *
     * /track/:
     *   post:
     *     description: Add a new track.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Track {track.title}, {track.id} has been created.
     *       400:
     *         description: Track {track} cannot be created. Title is mandatory.
     *       500:
     *         description: Error message.
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
            res.status(400).send(`Track ${track} cannot be created. Title is mandatory.`);
        }
        connection.end();
    });

    /**
     * @swagger
     *
     * /track/:
     *   get:
     *     description: Get all track save in system.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: {track}
     *       400:
     *         description: Track {track.title} not found in database.
     *       500:
     *         description: Error message.
     */
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

    /**
     * @swagger
     *
     * /track/linkPlaylist:
     *   post:
     *     description: To link a track to a playlist.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success (true/false).
     *       400:
     *         description: Track {link.idTrack} cannot be linked.
     *       500:
     *         description: Error message.
     */
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

    /**
     * @swagger
     *
     * /track/unlinkPlaylist:
     *   post:
     *     description: To delete a link between a track and a playlist.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success (true/false).
     *       400:
     *         description: Track {link.idTrack} cannot be unlinked.
     *       500:
     *         description: Error message.
     */
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


    /**
     * @swagger
     *
     * /track/:id:
     *   get:
     *     description: Get a track identified by id.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: {track}
     *       400:
     *         description: the song {track.id} does not exist in the database.
     *       500:
     *         description: Error message.
     */
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

    /**
     * @swagger
     *
     * /track/:id/artists:
     *   get:
     *     description: To get all artist for the track.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: (list artists)
     *       400:
     *         description: The song {track.id} does not have artists.
     *       500:
     *         description: Error message.
     */
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

    /**
     * @swagger
     *
     * /track/:id:
     *   put:
     *     description: To update a track information.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Track {track} has been updated.
     *       400:
     *         description: Track has not been updated, something is missing.
     *       500:
     *         description: Error message.
     */
    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_track = new track_entity.Track(req.body.artist,req.body.danceability,req.body.duration,
            req.body.energy, req.body.instrumentalness, req.body.liveness,
            req.body.name, req.body.popularity, req.body.year)
        //new_track.req.body.name, req.body.year, req.body.duration);
        track_model.UpdateTrack(connection, req.params.id, new_track).then((result) => {
            if (result != null) {
                res.status(200).send(`Track ${result} has been updated.`);
            } else {
                res.status(400).send(`Track has not been updated, something is missing.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    /**
     * @swagger
     *
     * /track/:id:
     *   put:
     *     description: To delete a track identified by his id.
     *     tags :
     *       - Track
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Track {track.id} has been deleted.
     *       400:
     *         description: Track {track.id} not found. Can not delete it.
     *       500:
     *         description: Error message.
     */
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
