const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const playlist_entity = require('../../entities/playlist')
const playlist_model = require('../../models/playlist')

module.exports = (config) => {

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

    router.get('/:id/track/:name', (req, res) => {
        console.log("playlist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre, req.body.id_user);
        playlist_model.UpdatePlaylist(connection, req.params.id, new_playlist);
        connection.end();
    });

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
