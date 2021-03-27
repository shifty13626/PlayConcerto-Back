const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const playlist_entity = require('../../entities/playlist')
const playlist_model = require('../../models/playlist')

module.exports = (config) => {

    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre);
        playlist_model.InsertPlaylist(connection, playlist).then((playlist_created) => {
            if (playlist_created['affectedRows'] !== 0) {
                res.status(200).send(`Playlist ${playlist.name} has been created.`);
            }
            else {
                res.status(400).send(`Playlist ${playlist} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
    });

    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.name != null ) {
            // ex : "/playlist?name=toto"
            playlist_model.GetPlaylistByName(connection, req.query.name).then((playlist) => {
                if (playlist != null) {
                    res.status(200).send(playlist);
                } else {
                    res.status(400).send(`Cannot get playlit ${req.query.name}, it does not exist`);
                }
            }).catch((error) => {
                res.status(500).send(error);
            });
        }else{
            playlist_model.GetAllPlaylists(connection).then( (playlists) => {
                if (playlists != null){
                    res.status(200).send(playlists);
                }
                else {
                    res.status(400).send(`Cannot get playlist, there is none in database.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            });
        }
    });

    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        playlist_model.GetPlaylistById(connection,req.params.id).then( (playlist) => {
            if(playlist != null){
                res.status(200).send(playlist);
            }
            else{
                res.status(400).send(`Cannot get ${playlist.name}, it does not exist.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("playlist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre);
        playlist_model.UpdatePlaylist(connection, req.params.id, new_playlist);
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
    });

    return router;
};
