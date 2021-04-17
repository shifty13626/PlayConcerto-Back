const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const playlist_entity = require('../../entities/playlist')
const playlist_model = require('../../models/playlist')

module.exports = (config) => {

    /**
     * @openapi
     * /api/playlist:
     *   post:
     *     description: Create a playlist in the database.
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {playlist.id} playlist created in the database.
     *       400:
     *         description: This playlist cannot be created, already existed or missing parameters.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.post('/', async(req, res) => {
        let connection = dbManager.OpenConnection(config);

        let playlist = req.body;
        console.log(playlist);
        const create = await playlist_model.InsertPlaylist(connection, playlist);
        console.log("result insert : " +create.affectedRows);
        if (create.affectedRows !== 0) {
            console.log("playlist created with id : " +create.insertId);

            // Link all genre of the playlist
            for (const id_genre of playlist.list_id_genre) {
                console.log("id genre ! " + id_genre);
                await playlist_model.LinkGenrePlaylist(connection, create.insertId, id_genre)
            }

            // Link user of playlist
            await playlist_model.LinkUserPlaylist(connection, create.insertId, playlist.id_user)

            // res.status(200).send();
            res.sendStatus(200);
        }
        else {
            res.status(400).send(`Playlist ${playlist} cannot be created. Pseudo is mandatory.`);
        }
    connection.end();
    });

    /**
     * @openapi
     * /api/playlist:
     *   get:
     *     description: Get all the playlist in the database, or one with parameter name.
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {playlists} All the playlist in the database, or the one with parameter name.
     *       400:
     *         description: No playlist in the databse, or the one searched does not exist.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.name != null ) {
            // ex : "/playlist?name=toto"
            playlist_model.GetPlaylistByName(connection, req.query.name).then((playlist) => {
                if (playlist != null) {
                    res.status(200).send(playlist[0]);
                } else {
                    res.status(400).send(`Cannot get playlit ${req.query.name}, it does not exist`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            });
        }else{
            playlist_model.GetAllPlaylists(connection).then( (playlists) => {
                if (playlists != null) {
                    res.status(200).send(playlists);
                }
                else {
                    res.status(400).send(`Cannot get playlist, there is none in database.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            });
        }
        connection.end();
    });

    /**
     * @openapi
     * /api/playlist/:id:
     *   get:
     *     description: Get a playlist by id.
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {playlist} playlist found in the database.
     *       400:
     *         description: This playlist cannot be found,it does not exist.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        playlist_model.GetPlaylistById(connection,req.params.id).then( (playlist) => {
            if(playlist != null){
                res.status(200).send(playlist[0]);
            }
            else{
                res.status(400).send(`Cannot get ${playlist.name}, it does not exist.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    // /api/track
    /**
     * @openapi
     * /api/playlist/:id/tracks:
     *   post:
     *     description: Get all tracks of one playlist
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {tracks} TRacks of all the playlist with playlist_id equals id.
     *       400:
     *         description: This playlist cannot be found, or there is no track in it.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.get('/:id/tracks', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        playlist_model.GetTrackPlaylist(connection,req.params.id).then( (tracks) => {
            if(tracks != null){
                res.status(200).send(tracks);
            }
            else{
                res.status(400).send(`Cannot get tracks, it does not exist.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    /**
     * @openapi
     * /api/playlist/:id:
     *   put:
     *     description: Update a playlist in the database.
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {playlist.id} playlist updated in the database.
     *       400:
     *         description: This playlist cannot be updated, does not exist or missing parameters.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre, req.body.id_user);
        playlist_model.UpdatePlaylist(connection, req.params.id, new_playlist);
        connection.end();
    });

    /**
     * @openapi
     * /api/playlist/:id:
     *   delete:
     *     description: Delete a playlist in the database.
     *     tags:
     *       - Playlist
     *     responses:
     *       200:
     *         description: {playlist.id} playlist deleted in the database.
     *       400:
     *         description: This playlist cannot be deleted, does not exist.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        playlist_model.DeletePlaylist(connection, req.params.id).then( (playlist_deleted) => {
            if (playlist_deleted['affectedRows'] !== 0) {
                res.status(200).send(`Playlist ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`Playlist ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });



    return router;
};
